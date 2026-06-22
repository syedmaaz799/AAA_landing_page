"use client"

import { useEffect, useRef, useState } from "react"
import { cn } from "@/lib/utils"

function getPixelRatio() {
  if (typeof window === "undefined") return 1
  return Math.min(window.devicePixelRatio, window.innerWidth < 768 ? 1.5 : 2)
}

const defaultShaderSource = `#version 300 es
precision highp float;
out vec4 O;
uniform vec2 resolution;
uniform float time;
#define FC gl_FragCoord.xy
#define T time
#define R resolution
#define MN min(R.x,R.y)
float rnd(vec2 p) {
  p=fract(p*vec2(12.9898,78.233));
  p+=dot(p,p+34.56);
  return fract(p.x*p.y);
}
float noise(in vec2 p) {
  vec2 i=floor(p), f=fract(p), u=f*f*(3.-2.*f);
  float a=rnd(i), b=rnd(i+vec2(1,0)), c=rnd(i+vec2(0,1)), d=rnd(i+1.);
  return mix(mix(a,b,u.x),mix(c,d,u.x),u.y);
}
float fbm(vec2 p) {
  float t=.0, a=1.; mat2 m=mat2(1.,-.5,.2,1.2);
  for (int i=0; i<4; i++) {
    t+=a*noise(p);
    p*=2.*m;
    a*=.5;
  }
  return t;
}
float clouds(vec2 p) {
  float d=1., t=.0;
  for (float i=.0; i<2.; i++) {
    float a=d*fbm(i*10.+p.x*.2+.2*(1.+i)*p.y+d+i*i+p);
    t=mix(t,d,a);
    d=a;
    p*=2./(i+1.);
  }
  return t;
}
void main(void) {
  vec2 uv=(FC-.5*R)/MN,st=uv*vec2(2,1);
  vec3 col=vec3(0.008,0.016,0.04);
  vec3 cyanBright=vec3(0.12,0.52,1.0);
  vec3 cyanMid=vec3(0.06,0.32,0.82);
  vec3 cyanDeep=vec3(0.02,0.12,0.35);
  float bg=clouds(vec2(st.x+T*.5,-st.y));
  vec3 cloudColor=mix(cyanDeep,cyanMid,bg)+cyanBright*bg*0.14;
  uv*=1.-.3*(sin(T*.2)*.5+.5);
  for (float i=1.; i<9.; i++) {
    uv+=.1*cos(i*vec2(.1+.01*i, .8)+i*i+T*.5+.1*uv.x);
    vec2 p=uv;
    float d=length(p);
    float pulse=0.5+0.5*cos(sin(i*1.4)+T*0.2);
    col+=(.00135/d)*mix(cyanMid,cyanBright,pulse);
    float b=noise(i+p+bg*1.731);
    col+=.0022*b/length(max(p,vec2(b*p.x*.02,p.y)))*cyanMid;
    col=mix(col,cloudColor,clamp(d*1.15,0.0,1.0));
  }
  col=mix(vec3(0.008,0.016,0.04),col,0.92);
  col+=cloudColor*0.08;
  O=vec4(col,1);
}`

function useShaderBackground(
  containerRef: React.RefObject<HTMLDivElement | null>,
  enabled: boolean,
  isVisible: boolean
) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationFrameRef = useRef<number>(0)
  const rendererRef = useRef<WebGLRenderer | null>(null)
  const pointersRef = useRef<PointerHandler | null>(null)
  const isVisibleRef = useRef(isVisible)

  isVisibleRef.current = isVisible

  class WebGLRenderer {
    private canvas: HTMLCanvasElement
    private gl: WebGL2RenderingContext
    private program: WebGLProgram | null = null
    private vs: WebGLShader | null = null
    private fs: WebGLShader | null = null
    private buffer: WebGLBuffer | null = null
    private scale: number
    private shaderSource: string
    private mouseMove = [0, 0]
    private mouseCoords = [0, 0]
    private pointerCoords = [0, 0]
    private nbrOfPointers = 0
    private uniforms: Record<string, WebGLUniformLocation | null> = {}

    private vertexSrc = `#version 300 es
precision highp float;
in vec4 position;
void main(){gl_Position=position;}`

    private vertices = [-1, 1, -1, -1, 1, 1, 1, -1]

    constructor(canvas: HTMLCanvasElement, scale: number) {
      this.canvas = canvas
      this.scale = scale
      this.gl = canvas.getContext("webgl2", {
        alpha: false,
        antialias: false,
        depth: false,
        stencil: false,
        powerPreference: "high-performance",
      })!
      this.gl.viewport(0, 0, canvas.width * scale, canvas.height * scale)
      this.shaderSource = defaultShaderSource
    }

    updateShader(source: string) {
      this.reset()
      this.shaderSource = source
      this.setup()
      this.init()
    }

    updateMove(deltas: number[]) {
      this.mouseMove = deltas
    }

    updateMouse(coords: number[]) {
      this.mouseCoords = coords
    }

    updatePointerCoords(coords: number[]) {
      this.pointerCoords = coords
    }

    updatePointerCount(nbr: number) {
      this.nbrOfPointers = nbr
    }

    updateScale(scale: number) {
      this.scale = scale
      this.gl.viewport(
        0,
        0,
        this.canvas.width * scale,
        this.canvas.height * scale
      )
    }

    compile(shader: WebGLShader, source: string) {
      const gl = this.gl
      gl.shaderSource(shader, source)
      gl.compileShader(shader)
    }

    test(source: string) {
      let result: string | null = null
      const gl = this.gl
      const shader = gl.createShader(gl.FRAGMENT_SHADER)!
      gl.shaderSource(shader, source)
      gl.compileShader(shader)
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        result = gl.getShaderInfoLog(shader)
      }
      gl.deleteShader(shader)
      return result
    }

    reset() {
      const gl = this.gl
      if (
        this.program &&
        !gl.getProgramParameter(this.program, gl.DELETE_STATUS)
      ) {
        if (this.vs) {
          gl.detachShader(this.program, this.vs)
          gl.deleteShader(this.vs)
        }
        if (this.fs) {
          gl.detachShader(this.program, this.fs)
          gl.deleteShader(this.fs)
        }
        gl.deleteProgram(this.program)
      }
    }

    setup() {
      const gl = this.gl
      this.vs = gl.createShader(gl.VERTEX_SHADER)!
      this.fs = gl.createShader(gl.FRAGMENT_SHADER)!
      this.compile(this.vs, this.vertexSrc)
      this.compile(this.fs, this.shaderSource)
      this.program = gl.createProgram()!
      gl.attachShader(this.program, this.vs)
      gl.attachShader(this.program, this.fs)
      gl.linkProgram(this.program)
    }

    init() {
      const gl = this.gl
      const program = this.program!
      this.buffer = gl.createBuffer()
      gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer)
      gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array(this.vertices),
        gl.STATIC_DRAW
      )
      const position = gl.getAttribLocation(program, "position")
      gl.enableVertexAttribArray(position)
      gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0)
      this.uniforms = {
        resolution: gl.getUniformLocation(program, "resolution"),
        time: gl.getUniformLocation(program, "time"),
        move: gl.getUniformLocation(program, "move"),
        touch: gl.getUniformLocation(program, "touch"),
        pointerCount: gl.getUniformLocation(program, "pointerCount"),
        pointers: gl.getUniformLocation(program, "pointers"),
      }
    }

    render(now = 0) {
      const gl = this.gl
      const program = this.program
      if (!program || gl.getProgramParameter(program, gl.DELETE_STATUS)) return
      gl.clearColor(0.016, 0.008, 0, 1)
      gl.clear(gl.COLOR_BUFFER_BIT)
      gl.useProgram(program)
      gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer)
      gl.uniform2f(
        this.uniforms.resolution,
        this.canvas.width,
        this.canvas.height
      )
      gl.uniform1f(this.uniforms.time, now * 1e-3)
      gl.uniform2f(this.uniforms.move, this.mouseMove[0], this.mouseMove[1])
      gl.uniform2f(this.uniforms.touch, this.mouseCoords[0], this.mouseCoords[1])
      gl.uniform1i(this.uniforms.pointerCount, this.nbrOfPointers)
      gl.uniform2fv(this.uniforms.pointers, this.pointerCoords)
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
    }
  }

  class PointerHandler {
    private scale: number
    private pointers = new Map<number, number[]>()
    private lastCoords = [0, 0]
    private moves = [0, 0]

    constructor(element: HTMLCanvasElement, scale: number) {
      this.scale = scale
      const map = (el: HTMLCanvasElement, s: number, x: number, y: number) =>
        [x * s, el.height - y * s]

      element.addEventListener(
        "pointermove",
        (e) => {
          this.lastCoords = [e.clientX, e.clientY]
          this.pointers.set(
            e.pointerId,
            map(element, this.getScale(), e.clientX, e.clientY)
          )
          this.moves = [this.moves[0] + e.movementX * 0.5, this.moves[1] + e.movementY * 0.5]
        },
        { passive: true }
      )
    }

    getScale() {
      return this.scale
    }

    get count() {
      return this.pointers.size
    }

    get move() {
      return this.moves
    }

    get coords() {
      return this.pointers.size > 0
        ? Array.from(this.pointers.values()).flat()
        : [0, 0]
    }

    get first() {
      return this.pointers.values().next().value || this.lastCoords
    }
  }

  useEffect(() => {
    if (!enabled || !canvasRef.current || !containerRef.current) return

    const canvas = canvasRef.current
    const container = containerRef.current
    const dpr = getPixelRatio()
    let running = true

    const resize = () => {
      if (!canvasRef.current || !containerRef.current) return
      const { width, height } = containerRef.current.getBoundingClientRect()
      const pixelRatio = getPixelRatio()
      canvasRef.current.width = Math.max(1, Math.floor(width * pixelRatio))
      canvasRef.current.height = Math.max(1, Math.floor(height * pixelRatio))
      canvasRef.current.style.width = `${width}px`
      canvasRef.current.style.height = `${height}px`
      rendererRef.current?.updateScale(pixelRatio)
    }

    const loop = (now: number) => {
      if (!running) return
      animationFrameRef.current = requestAnimationFrame(loop)
      if (!isVisibleRef.current || !rendererRef.current || !pointersRef.current) {
        return
      }
      rendererRef.current.updateMouse(pointersRef.current.first)
      rendererRef.current.updatePointerCount(pointersRef.current.count)
      rendererRef.current.updatePointerCoords(pointersRef.current.coords)
      rendererRef.current.updateMove(pointersRef.current.move)
      rendererRef.current.render(now)
    }

    rendererRef.current = new WebGLRenderer(canvas, dpr)
    pointersRef.current = new PointerHandler(canvas, dpr)
    rendererRef.current.setup()
    rendererRef.current.init()
    if (rendererRef.current.test(defaultShaderSource) === null) {
      rendererRef.current.updateShader(defaultShaderSource)
    }

    resize()
    animationFrameRef.current = requestAnimationFrame(loop)

    const observer = new ResizeObserver(resize)
    observer.observe(container)

    return () => {
      running = false
      observer.disconnect()
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
      rendererRef.current?.reset()
      rendererRef.current = null
      pointersRef.current = null
    }
  }, [containerRef, enabled])

  return canvasRef
}

export function AnimatedShaderHero({
  className,
  intensity = "full",
}: {
  className?: string
  intensity?: "full" | "medium" | "low"
}) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [mounted, setMounted] = useState(false)
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted || !containerRef.current) return

    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.05, rootMargin: "50px" }
    )
    observer.observe(containerRef.current)
    return () => observer.disconnect()
  }, [mounted])

  const canvasRef = useShaderBackground(containerRef, mounted, isVisible)

  const opacity =
    intensity === "full"
      ? "opacity-100"
      : intensity === "medium"
        ? "opacity-75 md:opacity-100"
        : "opacity-60"

  return (
    <div
      ref={containerRef}
      className={cn(
        "pointer-events-none absolute inset-0 overflow-hidden transform-gpu",
        opacity,
        className
      )}
      aria-hidden="true"
    >
      <div className="hero-shader-base absolute inset-0" />
      <canvas
        ref={canvasRef}
        className={cn(
          "absolute inset-0 h-full w-full touch-none transform-gpu transition-opacity duration-700",
          mounted ? "opacity-100" : "opacity-0"
        )}
        style={{ background: "#02040b" }}
      />
      <div className="hero-shader-overlay absolute inset-0" />
      <div className="hero-shader-vignette absolute inset-0" />
    </div>
  )
}

export default AnimatedShaderHero
