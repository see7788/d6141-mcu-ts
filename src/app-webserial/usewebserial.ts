import { useState } from 'react'
type ResStream_analysis_op = "{}" | "\n"
class ResStream_analysis {
    transform: (chunk: string, controller: any) => void | Promise<void>
    container: string = ''
    container_max = 3000
    l = "{"
    r = "}"
    ll = 0
    rl = 0
    constructor(t: ResStream_analysis_op = "\n") {
        if (t == "{}") {
            this.transform = this.json
        } else {
            this.transform = this.n
        }
    }
    async json(chunk: string, controller: any) {
        chunk.split("").map(v => {
            if (this.container.length > this.container_max) {
                this.container = ""
                return
            }
            if (this.ll > 0 || v == "l") {
                this.container += v;
            }
            if (v === "{") {
                this.ll += 1;
            } else if (v === "}") {
                this.rl += 1;
            }
            if (this.ll === this.rl) {
                this.ll = 0
                this.rl = 0
                controller.enqueue(this.container);
                this.container = ""
            }
        })
    }
    async n(chunk: string, controller: any) {
        chunk.split("").map(v => {
            if (v === "\n") {
                controller.enqueue(this.container);
                this.container = ""
            } else if (this.container.length > this.container_max) {
                this.container = ""
            } else {
                this.container += v;
            }
        })
    }
    flush(controller: any) {
        controller.enqueue("flush");
    }
}
export class ResClass {
    private decoder: TextDecoderStream
    private readableStreamClosed: Promise<void>
    private reader: ReadableStreamDefaultReader<any>
    constructor(public readable: ReadableStream<Uint8Array>, op: ResStream_analysis_op) {
        this.decoder = new TextDecoderStream("utf-8", {});
        this.readableStreamClosed = readable.pipeTo(this.decoder.writable);
        this.reader = this.decoder.readable.pipeThrough(new TransformStream(new ResStream_analysis(op))).getReader();
        this.close = async () => {
            {
                try {
                    await this.reader.cancel().catch(console.error);
                    await this.readableStreamClosed.catch(console.error)
                } catch (e) {
                    console.log(e)
                }
            }
        }
        this.on = async (useDb) => {
            while (this.readable) {
                const { value, done } = await this.reader.read()
                if (value) {
                    useDb(value)
                }
                if (done) {
                    this.reader.releaseLock();
                    break;
                }
            }
        }
    }
    close: () => Promise<any>
    on: (useDb: (str: string) => any | Promise<any>) => Promise<void>
}
export class SendClass {
    private encoder: TextEncoderStream
    private writableStreamClosed: Promise<any>
    private writer: WritableStreamDefaultWriter<string>
    constructor(public writable: WritableStream<Uint8Array>, ext: "\n" | "\r\n") {
        this.encoder = new TextEncoderStream();
        this.writableStreamClosed = this.encoder.readable.pipeTo(writable);
        this.writer = this.encoder.writable.getWriter();
        this.close = async () => {
            await this.writer.close().catch(console.error);
            await this.writableStreamClosed.catch(console.error)
        }
        this.send = async (str) => {
            await this.writer.write(str + ext).catch(console.error);
        }
    }
    close: () => Promise<void>
    send: (str: string) => Promise<void>
}
export default () => {
    const [port, set_port] = useState<SerialPort>();
    const [errorMsg, set_errorMsg] = useState("")
    const set_Msg = (v: any) => set_errorMsg(s => s + "///" + v);
    async function send(str: string) {
        if (port?.writable) {
            const encoder = new TextEncoderStream();
            encoder.readable.pipeTo(port.writable);
            const writer = encoder.writable.getWriter();
            await writer.write(str + "\n").catch(set_Msg)
            await writer.close()
        } else {
            set_Msg("!port?.writable")
        }
    }
    async function on(useDb: (str: string) => void | Promise<void>) {
        if (port?.readable) {
            const decoder = new TextDecoderStream("utf-8", {});
            port.readable.pipeTo(decoder.writable).catch(set_Msg);
            const reader = decoder.readable.pipeThrough(new TransformStream(new ResStream_analysis("\n"))).getReader();
            while (port) {
                try {
                    const { value, done } = await reader.read()
                    if (value) {
                        useDb(value)
                    }
                    if (done) {
                        reader.releaseLock();
                        break;
                    }
                } catch (e) {
                    set_Msg(e)
                }
            }
            // await reader.cancel();
            // await readableStreamClosed.catch(console.error)
            // await port.close().catch(console.error);
        } else {
            set_Msg("!port.readable")
        }
    }
    async function portOpen(
        op: SerialPortRequestOptions,
        op2: SerialOptions,
    ) {
        try {
            const port = await navigator.serial.requestPort(op)
            if (port) {
                set_port(port);
                port.open(op2);
            } else {
                set_Msg("! port")
            }
        } catch (e) {
            set_Msg(e)
        }
    }
    return { portOpen, port, send, on, errorMsg }
}