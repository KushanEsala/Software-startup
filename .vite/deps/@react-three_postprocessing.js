import {
  applyProps,
  createPortal,
  extend,
  useFrame,
  useLoader,
  useThree
} from "./chunk-XQ5ZBDWI.js";
import {
  AlwaysDepth,
  BackSide,
  BasicDepthPacking,
  Box3,
  BoxGeometry,
  BufferAttribute,
  BufferGeometry,
  Camera,
  CanvasTexture,
  ClampToEdgeWrapping,
  Color,
  Data3DTexture,
  DataTexture,
  DepthStencilFormat,
  DepthTexture,
  DoubleSide,
  EqualDepth,
  Euler,
  EventDispatcher,
  Float32BufferAttribute,
  FloatType,
  FrontSide,
  GreaterDepth,
  GreaterEqualDepth,
  HalfFloatType,
  LessDepth,
  LessEqualDepth,
  LinearFilter,
  LinearMipmapLinearFilter,
  LinearSRGBColorSpace,
  LoadingManager,
  Material,
  Matrix3,
  Matrix4,
  Mesh,
  MeshDepthMaterial,
  MeshNormalMaterial,
  NearestFilter,
  NeverDepth,
  NoBlending,
  NoColorSpace,
  NoToneMapping,
  NotEqualDepth,
  OrthographicCamera,
  PerspectiveCamera,
  Quaternion,
  REVISION,
  RGBADepthPacking,
  RGBAFormat,
  RGFormat,
  RedFormat,
  RepeatWrapping,
  SRGBColorSpace,
  Scene,
  ShaderMaterial,
  Sphere,
  Spherical,
  Texture,
  TextureLoader,
  Triangle,
  Uniform,
  UnsignedByteType,
  UnsignedInt248Type,
  UnsignedIntType,
  Vector2,
  Vector3,
  Vector4,
  WebGLRenderTarget
} from "./chunk-JTRL6DIZ.js";
import {
  require_jsx_runtime
} from "./chunk-FT54CQ4H.js";
import {
  require_react
} from "./chunk-TVFQMRVC.js";
import {
  __toESM
} from "./chunk-G3PMV62Z.js";

// node_modules/@react-three/postprocessing/dist/index.js
var import_jsx_runtime = __toESM(require_jsx_runtime());
var import_react = __toESM(require_react());

// node_modules/postprocessing/build/index.js
var MILLISECONDS_TO_SECONDS = 1 / 1e3;
var SECONDS_TO_MILLISECONDS = 1e3;
var Timer = class {
  /**
   * Constructs a new timer.
   */
  constructor() {
    this.startTime = performance.now();
    this.previousTime = 0;
    this.currentTime = 0;
    this._delta = 0;
    this._elapsed = 0;
    this._fixedDelta = 1e3 / 60;
    this.timescale = 1;
    this.useFixedDelta = false;
    this._autoReset = false;
  }
  /**
   * Enables or disables auto reset based on page visibility.
   *
   * If enabled, the timer will be reset when the page becomes visible. This effectively pauses the timer when the page
   * is hidden. Has no effect if the API is not supported.
   *
   * @type {Boolean}
   * @see https://developer.mozilla.org/en-US/docs/Web/API/Page_Visibility_API
   */
  get autoReset() {
    return this._autoReset;
  }
  set autoReset(value) {
    if (typeof document !== "undefined" && document.hidden !== void 0) {
      if (value) {
        document.addEventListener("visibilitychange", this);
      } else {
        document.removeEventListener("visibilitychange", this);
      }
      this._autoReset = value;
    }
  }
  get delta() {
    return this._delta * MILLISECONDS_TO_SECONDS;
  }
  get fixedDelta() {
    return this._fixedDelta * MILLISECONDS_TO_SECONDS;
  }
  set fixedDelta(value) {
    this._fixedDelta = value * SECONDS_TO_MILLISECONDS;
  }
  get elapsed() {
    return this._elapsed * MILLISECONDS_TO_SECONDS;
  }
  /**
   * Updates this timer.
   *
   * @param {Boolean} [timestamp] - The current time in milliseconds.
   */
  update(timestamp) {
    if (this.useFixedDelta) {
      this._delta = this.fixedDelta;
    } else {
      this.previousTime = this.currentTime;
      this.currentTime = (timestamp !== void 0 ? timestamp : performance.now()) - this.startTime;
      this._delta = this.currentTime - this.previousTime;
    }
    this._delta *= this.timescale;
    this._elapsed += this._delta;
  }
  /**
   * Resets this timer.
   */
  reset() {
    this._delta = 0;
    this._elapsed = 0;
    this.currentTime = performance.now() - this.startTime;
  }
  getDelta() {
    return this.delta;
  }
  getElapsed() {
    return this.elapsed;
  }
  handleEvent(e) {
    if (!document.hidden) {
      this.currentTime = performance.now() - this.startTime;
    }
  }
  dispose() {
    this.autoReset = false;
  }
};
var fullscreenGeometry = (() => {
  const vertices = new Float32Array([-1, -1, 0, 3, -1, 0, -1, 3, 0]);
  const uvs = new Float32Array([0, 0, 2, 0, 0, 2]);
  const geometry2 = new BufferGeometry();
  geometry2.setAttribute("position", new BufferAttribute(vertices, 3));
  geometry2.setAttribute("uv", new BufferAttribute(uvs, 2));
  return geometry2;
})();
var Pass = class _Pass {
  /**
   * A shared fullscreen triangle.
   *
   * The screen size is 2x2 units (NDC). A triangle needs to be 4x4 units to fill the screen.
   * @see https://michaldrobot.com/2014/04/01/gcn-execution-patterns-in-full-screen-passes/
   * @type {BufferGeometry}
   * @internal
   */
  static get fullscreenGeometry() {
    return fullscreenGeometry;
  }
  /**
   * Constructs a new pass.
   *
   * @param {String} [name] - The name of this pass. Does not have to be unique.
   * @param {Scene} [scene] - The scene to render. The default scene contains a single mesh that fills the screen.
   * @param {Camera} [camera] - A camera. Fullscreen effect passes don't require a camera.
   */
  constructor(name = "Pass", scene = new Scene(), camera = new Camera()) {
    this.name = name;
    this.renderer = null;
    this.scene = scene;
    this.camera = camera;
    this.screen = null;
    this.rtt = true;
    this.needsSwap = true;
    this.needsDepthTexture = false;
    this.enabled = true;
  }
  /**
   * Sets the render to screen flag.
   *
   * If this flag is changed, the fullscreen material will be updated as well.
   *
   * @type {Boolean}
   */
  get renderToScreen() {
    return !this.rtt;
  }
  set renderToScreen(value) {
    if (this.rtt === value) {
      const material = this.fullscreenMaterial;
      if (material !== null) {
        material.needsUpdate = true;
      }
      this.rtt = !value;
    }
  }
  /**
   * Sets the main scene.
   *
   * @type {Scene}
   */
  set mainScene(value) {
  }
  /**
   * Sets the main camera.
   *
   * @type {Camera}
   */
  set mainCamera(value) {
  }
  /**
   * Sets the renderer
   *
   * @deprecated
   * @param {WebGLRenderer} renderer - The renderer.
   */
  setRenderer(renderer) {
    this.renderer = renderer;
  }
  /**
   * Indicates whether this pass is enabled.
   *
   * @deprecated Use enabled instead.
   * @return {Boolean} Whether this pass is enabled.
   */
  isEnabled() {
    return this.enabled;
  }
  /**
   * Enables or disables this pass.
   *
   * @deprecated Use enabled instead.
   * @param {Boolean} value - Whether the pass should be enabled.
   */
  setEnabled(value) {
    this.enabled = value;
  }
  /**
   * The fullscreen material.
   *
   * @type {Material}
   */
  get fullscreenMaterial() {
    return this.screen !== null ? this.screen.material : null;
  }
  set fullscreenMaterial(value) {
    let screen = this.screen;
    if (screen !== null) {
      screen.material = value;
    } else {
      screen = new Mesh(_Pass.fullscreenGeometry, value);
      screen.frustumCulled = false;
      if (this.scene === null) {
        this.scene = new Scene();
      }
      this.scene.add(screen);
      this.screen = screen;
    }
  }
  /**
   * Returns the current fullscreen material.
   *
   * @deprecated Use fullscreenMaterial instead.
   * @return {Material} The current fullscreen material, or null if there is none.
   */
  getFullscreenMaterial() {
    return this.fullscreenMaterial;
  }
  /**
   * Sets the fullscreen material.
   *
   * @deprecated Use fullscreenMaterial instead.
   * @protected
   * @param {Material} value - A fullscreen material.
   */
  setFullscreenMaterial(value) {
    this.fullscreenMaterial = value;
  }
  /**
   * Returns the current depth texture.
   *
   * @return {Texture} The current depth texture, or null if there is none.
   */
  getDepthTexture() {
    return null;
  }
  /**
   * Sets the depth texture.
   *
   * This method will be called automatically by the {@link EffectComposer}.
   * You may override this method if your pass relies on the depth information of a preceding {@link RenderPass}.
   *
   * @param {Texture} depthTexture - A depth texture.
   * @param {DepthPackingStrategy} [depthPacking=BasicDepthPacking] - The depth packing.
   */
  setDepthTexture(depthTexture, depthPacking = BasicDepthPacking) {
  }
  /**
   * Renders this pass.
   *
   * This is an abstract method that must be overridden.
   *
   * @abstract
   * @throws {Error} An error is thrown if the method is not overridden.
   * @param {WebGLRenderer} renderer - The renderer.
   * @param {WebGLRenderTarget} inputBuffer - A frame buffer that contains the result of the previous pass.
   * @param {WebGLRenderTarget} outputBuffer - A frame buffer that serves as the output render target unless this pass renders to screen.
   * @param {Number} [deltaTime] - The time between the last frame and the current one in seconds.
   * @param {Boolean} [stencilTest] - Indicates whether a stencil mask is active.
   */
  render(renderer, inputBuffer, outputBuffer, deltaTime, stencilTest) {
    throw new Error("Render method not implemented!");
  }
  /**
   * Sets the size.
   *
   * You may override this method if you want to be informed about the size of the backbuffer/canvas.
   * This method is called before {@link initialize} and every time the size of the {@link EffectComposer} changes.
   *
   * @param {Number} width - The width.
   * @param {Number} height - The height.
   */
  setSize(width, height) {
  }
  /**
   * Performs initialization tasks.
   *
   * This method is called when this pass is added to an {@link EffectComposer}.
   *
   * @param {WebGLRenderer} renderer - The renderer.
   * @param {Boolean} alpha - Whether the renderer uses the alpha channel or not.
   * @param {Number} frameBufferType - The type of the main frame buffers.
   */
  initialize(renderer, alpha, frameBufferType) {
  }
  /**
   * Performs a shallow search for disposable properties and deletes them.
   *
   * The {@link EffectComposer} calls this method when it is being destroyed. You can use it independently to free
   * memory when you're certain that you don't need this pass anymore.
   */
  dispose() {
    for (const key of Object.keys(this)) {
      const property = this[key];
      const isDisposable = property instanceof WebGLRenderTarget || property instanceof Material || property instanceof Texture || property instanceof _Pass;
      if (isDisposable) {
        this[key].dispose();
      }
    }
    if (this.fullscreenMaterial !== null) {
      this.fullscreenMaterial.dispose();
    }
  }
};
var ClearMaskPass = class extends Pass {
  /**
   * Constructs a new clear mask pass.
   */
  constructor() {
    super("ClearMaskPass", null, null);
    this.needsSwap = false;
  }
  /**
   * Disables the global stencil test.
   *
   * @param {WebGLRenderer} renderer - The renderer.
   * @param {WebGLRenderTarget} inputBuffer - A frame buffer that contains the result of the previous pass.
   * @param {WebGLRenderTarget} outputBuffer - A frame buffer that serves as the output render target unless this pass renders to screen.
   * @param {Number} [deltaTime] - The time between the last frame and the current one in seconds.
   * @param {Boolean} [stencilTest] - Indicates whether a stencil mask is active.
   */
  render(renderer, inputBuffer, outputBuffer, deltaTime, stencilTest) {
    const stencil = renderer.state.buffers.stencil;
    stencil.setLocked(false);
    stencil.setTest(false);
  }
};
var copy_default = `#include <common>
#include <dithering_pars_fragment>
#ifdef FRAMEBUFFER_PRECISION_HIGH
uniform mediump sampler2D inputBuffer;
#else
uniform lowp sampler2D inputBuffer;
#endif
uniform float opacity;varying vec2 vUv;void main(){vec4 texel=texture2D(inputBuffer,vUv);gl_FragColor=opacity*texel;
#include <colorspace_fragment>
#include <dithering_fragment>
}`;
var common_default = `varying vec2 vUv;void main(){vUv=position.xy*0.5+0.5;gl_Position=vec4(position.xy,1.0,1.0);}`;
var CopyMaterial = class extends ShaderMaterial {
  /**
   * Constructs a new copy material.
   */
  constructor() {
    super({
      name: "CopyMaterial",
      uniforms: {
        inputBuffer: new Uniform(null),
        opacity: new Uniform(1)
      },
      blending: NoBlending,
      toneMapped: false,
      depthWrite: false,
      depthTest: false,
      fragmentShader: copy_default,
      vertexShader: common_default
    });
  }
  /**
   * The input buffer.
   *
   * @type {Texture}
   */
  set inputBuffer(value) {
    this.uniforms.inputBuffer.value = value;
  }
  /**
   * Sets the input buffer.
   *
   * @deprecated Use inputBuffer instead.
   * @param {Number} value - The buffer.
   */
  setInputBuffer(value) {
    this.uniforms.inputBuffer.value = value;
  }
  /**
   * Returns the opacity.
   *
   * @deprecated Use opacity instead.
   * @return {Number} The opacity.
   */
  getOpacity(value) {
    return this.uniforms.opacity.value;
  }
  /**
   * Sets the opacity.
   *
   * @deprecated Use opacity instead.
   * @param {Number} value - The opacity.
   */
  setOpacity(value) {
    this.uniforms.opacity.value = value;
  }
};
var CopyPass = class extends Pass {
  /**
   * Constructs a new save pass.
   *
   * @param {WebGLRenderTarget} [renderTarget] - A render target.
   * @param {Boolean} [autoResize=true] - Whether the render target size should be updated automatically.
   */
  constructor(renderTarget, autoResize = true) {
    super("CopyPass");
    this.fullscreenMaterial = new CopyMaterial();
    this.needsSwap = false;
    this.renderTarget = renderTarget;
    if (renderTarget === void 0) {
      this.renderTarget = new WebGLRenderTarget(1, 1, {
        minFilter: LinearFilter,
        magFilter: LinearFilter,
        stencilBuffer: false,
        depthBuffer: false
      });
      this.renderTarget.texture.name = "CopyPass.Target";
    }
    this.autoResize = autoResize;
  }
  /**
   * Enables or disables auto resizing of the render target.
   *
   * @deprecated Use autoResize instead.
   * @type {Boolean}
   */
  get resize() {
    return this.autoResize;
  }
  set resize(value) {
    this.autoResize = value;
  }
  /**
   * The output texture.
   *
   * @type {Texture}
   */
  get texture() {
    return this.renderTarget.texture;
  }
  /**
   * Returns the output texture.
   *
   * @deprecated Use texture instead.
   * @return {Texture} The texture.
   */
  getTexture() {
    return this.renderTarget.texture;
  }
  /**
   * Enables or disables auto resizing of the render target.
   *
   * @deprecated Use autoResize instead.
   * @param {Boolean} value - Whether the render target size should be updated automatically.
   */
  setAutoResizeEnabled(value) {
    this.autoResize = value;
  }
  /**
   * Saves the input buffer.
   *
   * @param {WebGLRenderer} renderer - The renderer.
   * @param {WebGLRenderTarget} inputBuffer - A frame buffer that contains the result of the previous pass.
   * @param {WebGLRenderTarget} outputBuffer - A frame buffer that serves as the output render target unless this pass renders to screen.
   * @param {Number} [deltaTime] - The time between the last frame and the current one in seconds.
   * @param {Boolean} [stencilTest] - Indicates whether a stencil mask is active.
   */
  render(renderer, inputBuffer, outputBuffer, deltaTime, stencilTest) {
    this.fullscreenMaterial.inputBuffer = inputBuffer.texture;
    renderer.setRenderTarget(this.renderToScreen ? null : this.renderTarget);
    renderer.render(this.scene, this.camera);
  }
  /**
   * Updates the size of this pass.
   *
   * @param {Number} width - The width.
   * @param {Number} height - The height.
   */
  setSize(width, height) {
    if (this.autoResize) {
      this.renderTarget.setSize(width, height);
    }
  }
  /**
   * Performs initialization tasks.
   *
   * @param {WebGLRenderer} renderer - A renderer.
   * @param {Boolean} alpha - Whether the renderer uses the alpha channel.
   * @param {Number} frameBufferType - The type of the main frame buffers.
   */
  initialize(renderer, alpha, frameBufferType) {
    if (frameBufferType !== void 0) {
      this.renderTarget.texture.type = frameBufferType;
      if (frameBufferType !== UnsignedByteType) {
        this.fullscreenMaterial.defines.FRAMEBUFFER_PRECISION_HIGH = "1";
      } else if (renderer !== null && renderer.outputColorSpace === SRGBColorSpace) {
        this.renderTarget.texture.colorSpace = SRGBColorSpace;
      }
    }
  }
};
var color = new Color();
var ClearPass = class extends Pass {
  /**
   * Constructs a new clear pass.
   *
   * @param {Boolean} [color=true] - Determines whether the color buffer should be cleared.
   * @param {Boolean} [depth=true] - Determines whether the depth buffer should be cleared.
   * @param {Boolean} [stencil=false] - Determines whether the stencil buffer should be cleared.
   */
  constructor(color2 = true, depth = true, stencil = false) {
    super("ClearPass", null, null);
    this.needsSwap = false;
    this.color = color2;
    this.depth = depth;
    this.stencil = stencil;
    this.overrideClearColor = null;
    this.overrideClearAlpha = -1;
  }
  /**
   * Sets the clear flags.
   *
   * @param {Boolean} color - Whether the color buffer should be cleared.
   * @param {Boolean} depth - Whether the depth buffer should be cleared.
   * @param {Boolean} stencil - Whether the stencil buffer should be cleared.
   */
  setClearFlags(color2, depth, stencil) {
    this.color = color2;
    this.depth = depth;
    this.stencil = stencil;
  }
  /**
   * Returns the override clear color. Default is null.
   *
   * @deprecated Use overrideClearColor instead.
   * @return {Color} The clear color.
   */
  getOverrideClearColor() {
    return this.overrideClearColor;
  }
  /**
   * Sets the override clear color.
   *
   * @deprecated Use overrideClearColor instead.
   * @param {Color} value - The clear color.
   */
  setOverrideClearColor(value) {
    this.overrideClearColor = value;
  }
  /**
   * Returns the override clear alpha. Default is -1.
   *
   * @deprecated Use overrideClearAlpha instead.
   * @return {Number} The clear alpha.
   */
  getOverrideClearAlpha() {
    return this.overrideClearAlpha;
  }
  /**
   * Sets the override clear alpha.
   *
   * @deprecated Use overrideClearAlpha instead.
   * @param {Number} value - The clear alpha.
   */
  setOverrideClearAlpha(value) {
    this.overrideClearAlpha = value;
  }
  /**
   * Clears the input buffer or the screen.
   *
   * @param {WebGLRenderer} renderer - The renderer.
   * @param {WebGLRenderTarget} inputBuffer - A frame buffer that contains the result of the previous pass.
   * @param {WebGLRenderTarget} outputBuffer - A frame buffer that serves as the output render target unless this pass renders to screen.
   * @param {Number} [deltaTime] - The time between the last frame and the current one in seconds.
   * @param {Boolean} [stencilTest] - Indicates whether a stencil mask is active.
   */
  render(renderer, inputBuffer, outputBuffer, deltaTime, stencilTest) {
    const overrideClearColor = this.overrideClearColor;
    const overrideClearAlpha = this.overrideClearAlpha;
    const clearAlpha = renderer.getClearAlpha();
    const hasOverrideClearColor = overrideClearColor !== null;
    const hasOverrideClearAlpha = overrideClearAlpha >= 0;
    if (hasOverrideClearColor) {
      renderer.getClearColor(color);
      renderer.setClearColor(overrideClearColor, hasOverrideClearAlpha ? overrideClearAlpha : clearAlpha);
    } else if (hasOverrideClearAlpha) {
      renderer.setClearAlpha(overrideClearAlpha);
    }
    renderer.setRenderTarget(this.renderToScreen ? null : inputBuffer);
    renderer.clear(this.color, this.depth, this.stencil);
    if (hasOverrideClearColor) {
      renderer.setClearColor(color, clearAlpha);
    } else if (hasOverrideClearAlpha) {
      renderer.setClearAlpha(clearAlpha);
    }
  }
};
var MaskPass = class extends Pass {
  /**
   * Constructs a new mask pass.
   *
   * @param {Scene} scene - The scene to render.
   * @param {Camera} camera - The camera to use.
   */
  constructor(scene, camera) {
    super("MaskPass", scene, camera);
    this.needsSwap = false;
    this.clearPass = new ClearPass(false, false, true);
    this.inverse = false;
  }
  set mainScene(value) {
    this.scene = value;
  }
  set mainCamera(value) {
    this.camera = value;
  }
  /**
   * Indicates whether the mask should be inverted.
   *
   * @type {Boolean}
   */
  get inverted() {
    return this.inverse;
  }
  set inverted(value) {
    this.inverse = value;
  }
  /**
   * Indicates whether this pass should clear the stencil buffer.
   *
   * @type {Boolean}
   * @deprecated Use clearPass.enabled instead.
   */
  get clear() {
    return this.clearPass.enabled;
  }
  set clear(value) {
    this.clearPass.enabled = value;
  }
  /**
   * Returns the internal clear pass.
   *
   * @deprecated Use clearPass.enabled instead.
   * @return {ClearPass} The clear pass.
   */
  getClearPass() {
    return this.clearPass;
  }
  /**
   * Indicates whether the mask is inverted.
   *
   * @deprecated Use inverted instead.
   * @return {Boolean} Whether the mask is inverted.
   */
  isInverted() {
    return this.inverted;
  }
  /**
   * Enables or disable mask inversion.
   *
   * @deprecated Use inverted instead.
   * @param {Boolean} value - Whether the mask should be inverted.
   */
  setInverted(value) {
    this.inverted = value;
  }
  /**
   * Renders the effect.
   *
   * @param {WebGLRenderer} renderer - The renderer.
   * @param {WebGLRenderTarget} inputBuffer - A frame buffer that contains the result of the previous pass.
   * @param {WebGLRenderTarget} outputBuffer - A frame buffer that serves as the output render target unless this pass renders to screen.
   * @param {Number} [deltaTime] - The time between the last frame and the current one in seconds.
   * @param {Boolean} [stencilTest] - Indicates whether a stencil mask is active.
   */
  render(renderer, inputBuffer, outputBuffer, deltaTime, stencilTest) {
    const context = renderer.getContext();
    const buffers = renderer.state.buffers;
    const scene = this.scene;
    const camera = this.camera;
    const clearPass = this.clearPass;
    const writeValue = this.inverted ? 0 : 1;
    const clearValue = 1 - writeValue;
    buffers.color.setMask(false);
    buffers.depth.setMask(false);
    buffers.color.setLocked(true);
    buffers.depth.setLocked(true);
    buffers.stencil.setTest(true);
    buffers.stencil.setOp(context.REPLACE, context.REPLACE, context.REPLACE);
    buffers.stencil.setFunc(context.ALWAYS, writeValue, 4294967295);
    buffers.stencil.setClear(clearValue);
    buffers.stencil.setLocked(true);
    if (this.clearPass.enabled) {
      if (this.renderToScreen) {
        clearPass.render(renderer, null);
      } else {
        clearPass.render(renderer, inputBuffer);
        clearPass.render(renderer, outputBuffer);
      }
    }
    if (this.renderToScreen) {
      renderer.setRenderTarget(null);
      renderer.render(scene, camera);
    } else {
      renderer.setRenderTarget(inputBuffer);
      renderer.render(scene, camera);
      renderer.setRenderTarget(outputBuffer);
      renderer.render(scene, camera);
    }
    buffers.color.setLocked(false);
    buffers.depth.setLocked(false);
    buffers.stencil.setLocked(false);
    buffers.stencil.setFunc(context.EQUAL, 1, 4294967295);
    buffers.stencil.setOp(context.KEEP, context.KEEP, context.KEEP);
    buffers.stencil.setLocked(true);
  }
};
var EffectComposer = class {
  /**
   * Constructs a new effect composer.
   *
   * @param {WebGLRenderer} renderer - The renderer that should be used.
   * @param {Object} [options] - The options.
   * @param {Boolean} [options.depthBuffer=true] - Whether the main render targets should have a depth buffer.
   * @param {Boolean} [options.stencilBuffer=false] - Whether the main render targets should have a stencil buffer.
   * @param {Boolean} [options.alpha] - Deprecated. Buffers are always RGBA since three r137.
   * @param {Number} [options.multisampling=0] - The number of samples used for multisample antialiasing. Requires WebGL 2.
   * @param {Number} [options.frameBufferType] - The type of the internal frame buffers. It's recommended to use HalfFloatType if possible.
   */
  constructor(renderer = null, {
    depthBuffer = true,
    stencilBuffer = false,
    multisampling = 0,
    frameBufferType
  } = {}) {
    this.renderer = null;
    this.inputBuffer = this.createBuffer(depthBuffer, stencilBuffer, frameBufferType, multisampling);
    this.outputBuffer = this.inputBuffer.clone();
    this.copyPass = new CopyPass();
    this.depthTexture = null;
    this.passes = [];
    this.timer = new Timer();
    this.autoRenderToScreen = true;
    this.setRenderer(renderer);
  }
  /**
   * The current amount of samples used for multisample anti-aliasing.
   *
   * @type {Number}
   */
  get multisampling() {
    return this.inputBuffer.samples || 0;
  }
  /**
   * Sets the amount of MSAA samples.
   *
   * Requires WebGL 2. Set to zero to disable multisampling.
   *
   * @type {Number}
   */
  set multisampling(value) {
    const buffer2 = this.inputBuffer;
    const multisampling = this.multisampling;
    if (multisampling > 0 && value > 0) {
      this.inputBuffer.samples = value;
      this.outputBuffer.samples = value;
      this.inputBuffer.dispose();
      this.outputBuffer.dispose();
    } else if (multisampling !== value) {
      this.inputBuffer.dispose();
      this.outputBuffer.dispose();
      this.inputBuffer = this.createBuffer(
        buffer2.depthBuffer,
        buffer2.stencilBuffer,
        buffer2.texture.type,
        value
      );
      this.inputBuffer.depthTexture = this.depthTexture;
      this.outputBuffer = this.inputBuffer.clone();
    }
  }
  /**
   * Returns the internal timer.
   *
   * @return {Timer} The timer.
   */
  getTimer() {
    return this.timer;
  }
  /**
   * Returns the renderer.
   *
   * @return {WebGLRenderer} The renderer.
   */
  getRenderer() {
    return this.renderer;
  }
  /**
   * Sets the renderer.
   *
   * @param {WebGLRenderer} renderer - The renderer.
   */
  setRenderer(renderer) {
    this.renderer = renderer;
    if (renderer !== null) {
      const size = renderer.getSize(new Vector2());
      const alpha = renderer.getContext().getContextAttributes().alpha;
      const frameBufferType = this.inputBuffer.texture.type;
      if (frameBufferType === UnsignedByteType && renderer.outputColorSpace === SRGBColorSpace) {
        this.inputBuffer.texture.colorSpace = SRGBColorSpace;
        this.outputBuffer.texture.colorSpace = SRGBColorSpace;
        this.inputBuffer.dispose();
        this.outputBuffer.dispose();
      }
      renderer.autoClear = false;
      this.setSize(size.width, size.height);
      for (const pass of this.passes) {
        pass.initialize(renderer, alpha, frameBufferType);
      }
    }
  }
  /**
   * Replaces the current renderer with the given one.
   *
   * The auto clear mechanism of the provided renderer will be disabled. If the new render size differs from the
   * previous one, all passes will be updated.
   *
   * By default, the DOM element of the current renderer will automatically be removed from its parent node and the DOM
   * element of the new renderer will take its place.
   *
   * @deprecated Use setRenderer instead.
   * @param {WebGLRenderer} renderer - The new renderer.
   * @param {Boolean} updateDOM - Indicates whether the old canvas should be replaced by the new one in the DOM.
   * @return {WebGLRenderer} The old renderer.
   */
  replaceRenderer(renderer, updateDOM = true) {
    const oldRenderer = this.renderer;
    const parent = oldRenderer.domElement.parentNode;
    this.setRenderer(renderer);
    if (updateDOM && parent !== null) {
      parent.removeChild(oldRenderer.domElement);
      parent.appendChild(renderer.domElement);
    }
    return oldRenderer;
  }
  /**
   * Creates a depth texture attachment that will be provided to all passes.
   *
   * Note: When a shader reads from a depth texture and writes to a render target that uses the same depth texture
   * attachment, the depth information will be lost. This happens even if `depthWrite` is disabled.
   *
   * @private
   * @return {DepthTexture} The depth texture.
   */
  createDepthTexture() {
    const depthTexture = this.depthTexture = new DepthTexture();
    this.inputBuffer.depthTexture = depthTexture;
    this.inputBuffer.dispose();
    if (this.inputBuffer.stencilBuffer) {
      depthTexture.format = DepthStencilFormat;
      depthTexture.type = UnsignedInt248Type;
    } else {
      depthTexture.type = UnsignedIntType;
    }
    return depthTexture;
  }
  /**
   * Deletes the current depth texture.
   *
   * @private
   */
  deleteDepthTexture() {
    if (this.depthTexture !== null) {
      this.depthTexture.dispose();
      this.depthTexture = null;
      this.inputBuffer.depthTexture = null;
      this.inputBuffer.dispose();
      for (const pass of this.passes) {
        pass.setDepthTexture(null);
      }
    }
  }
  /**
   * Creates a new render target.
   *
   * @deprecated Create buffers manually via WebGLRenderTarget instead.
   * @param {Boolean} depthBuffer - Whether the render target should have a depth buffer.
   * @param {Boolean} stencilBuffer - Whether the render target should have a stencil buffer.
   * @param {Number} type - The frame buffer type.
   * @param {Number} multisampling - The number of samples to use for antialiasing.
   * @return {WebGLRenderTarget} A new render target that equals the renderer's canvas.
   */
  createBuffer(depthBuffer, stencilBuffer, type, multisampling) {
    const renderer = this.renderer;
    const size = renderer === null ? new Vector2() : renderer.getDrawingBufferSize(new Vector2());
    const options = {
      minFilter: LinearFilter,
      magFilter: LinearFilter,
      stencilBuffer,
      depthBuffer,
      type
    };
    const renderTarget = new WebGLRenderTarget(size.width, size.height, options);
    if (multisampling > 0) {
      renderTarget.ignoreDepthForMultisampleCopy = false;
      renderTarget.samples = multisampling;
    }
    if (type === UnsignedByteType && renderer !== null && renderer.outputColorSpace === SRGBColorSpace) {
      renderTarget.texture.colorSpace = SRGBColorSpace;
    }
    renderTarget.texture.name = "EffectComposer.Buffer";
    renderTarget.texture.generateMipmaps = false;
    return renderTarget;
  }
  /**
   * Can be used to change the main scene for all registered passes and effects.
   *
   * @param {Scene} scene - The scene.
   */
  setMainScene(scene) {
    for (const pass of this.passes) {
      pass.mainScene = scene;
    }
  }
  /**
   * Can be used to change the main camera for all registered passes and effects.
   *
   * @param {Camera} camera - The camera.
   */
  setMainCamera(camera) {
    for (const pass of this.passes) {
      pass.mainCamera = camera;
    }
  }
  /**
   * Adds a pass, optionally at a specific index.
   *
   * @param {Pass} pass - A new pass.
   * @param {Number} [index] - An index at which the pass should be inserted.
   */
  addPass(pass, index2) {
    const passes = this.passes;
    const renderer = this.renderer;
    const drawingBufferSize = renderer.getDrawingBufferSize(new Vector2());
    const alpha = renderer.getContext().getContextAttributes().alpha;
    const frameBufferType = this.inputBuffer.texture.type;
    pass.setRenderer(renderer);
    pass.setSize(drawingBufferSize.width, drawingBufferSize.height);
    pass.initialize(renderer, alpha, frameBufferType);
    if (this.autoRenderToScreen) {
      if (passes.length > 0) {
        passes[passes.length - 1].renderToScreen = false;
      }
      if (pass.renderToScreen) {
        this.autoRenderToScreen = false;
      }
    }
    if (index2 !== void 0) {
      passes.splice(index2, 0, pass);
    } else {
      passes.push(pass);
    }
    if (this.autoRenderToScreen) {
      passes[passes.length - 1].renderToScreen = true;
    }
    if (pass.needsDepthTexture || this.depthTexture !== null) {
      if (this.depthTexture === null) {
        const depthTexture = this.createDepthTexture();
        for (pass of passes) {
          pass.setDepthTexture(depthTexture);
        }
      } else {
        pass.setDepthTexture(this.depthTexture);
      }
    }
  }
  /**
   * Removes a pass.
   *
   * @param {Pass} pass - The pass.
   */
  removePass(pass) {
    const passes = this.passes;
    const index2 = passes.indexOf(pass);
    const exists = index2 !== -1;
    const removed = exists && passes.splice(index2, 1).length > 0;
    if (removed) {
      if (this.depthTexture !== null) {
        const reducer = (a, b) => a || b.needsDepthTexture;
        const depthTextureRequired = passes.reduce(reducer, false);
        if (!depthTextureRequired) {
          if (pass.getDepthTexture() === this.depthTexture) {
            pass.setDepthTexture(null);
          }
          this.deleteDepthTexture();
        }
      }
      if (this.autoRenderToScreen) {
        if (index2 === passes.length) {
          pass.renderToScreen = false;
          if (passes.length > 0) {
            passes[passes.length - 1].renderToScreen = true;
          }
        }
      }
    }
  }
  /**
   * Removes all passes.
   */
  removeAllPasses() {
    const passes = this.passes;
    this.deleteDepthTexture();
    if (passes.length > 0) {
      if (this.autoRenderToScreen) {
        passes[passes.length - 1].renderToScreen = false;
      }
      this.passes = [];
    }
  }
  /**
   * Renders all enabled passes in the order in which they were added.
   *
   * @param {Number} [deltaTime] - The time since the last frame in seconds.
   */
  render(deltaTime) {
    const renderer = this.renderer;
    const copyPass = this.copyPass;
    let inputBuffer = this.inputBuffer;
    let outputBuffer = this.outputBuffer;
    let stencilTest = false;
    let context, stencil, buffer2;
    if (deltaTime === void 0) {
      this.timer.update();
      deltaTime = this.timer.getDelta();
    }
    for (const pass of this.passes) {
      if (pass.enabled) {
        pass.render(renderer, inputBuffer, outputBuffer, deltaTime, stencilTest);
        if (pass.needsSwap) {
          if (stencilTest) {
            copyPass.renderToScreen = pass.renderToScreen;
            context = renderer.getContext();
            stencil = renderer.state.buffers.stencil;
            stencil.setFunc(context.NOTEQUAL, 1, 4294967295);
            copyPass.render(renderer, inputBuffer, outputBuffer, deltaTime, stencilTest);
            stencil.setFunc(context.EQUAL, 1, 4294967295);
          }
          buffer2 = inputBuffer;
          inputBuffer = outputBuffer;
          outputBuffer = buffer2;
        }
        if (pass instanceof MaskPass) {
          stencilTest = true;
        } else if (pass instanceof ClearMaskPass) {
          stencilTest = false;
        }
      }
    }
  }
  /**
   * Sets the size of the buffers, passes and the renderer.
   *
   * @param {Number} width - The width.
   * @param {Number} height - The height.
   * @param {Boolean} [updateStyle] - Determines whether the style of the canvas should be updated.
   */
  setSize(width, height, updateStyle) {
    const renderer = this.renderer;
    const currentSize = renderer.getSize(new Vector2());
    if (width === void 0 || height === void 0) {
      width = currentSize.width;
      height = currentSize.height;
    }
    if (currentSize.width !== width || currentSize.height !== height) {
      renderer.setSize(width, height, updateStyle);
    }
    const drawingBufferSize = renderer.getDrawingBufferSize(new Vector2());
    this.inputBuffer.setSize(drawingBufferSize.width, drawingBufferSize.height);
    this.outputBuffer.setSize(drawingBufferSize.width, drawingBufferSize.height);
    for (const pass of this.passes) {
      pass.setSize(drawingBufferSize.width, drawingBufferSize.height);
    }
  }
  /**
   * Resets this composer by deleting all passes and creating new buffers.
   */
  reset() {
    this.dispose();
    this.autoRenderToScreen = true;
  }
  /**
   * Disposes this composer and all passes.
   */
  dispose() {
    for (const pass of this.passes) {
      pass.dispose();
    }
    this.passes = [];
    if (this.inputBuffer !== null) {
      this.inputBuffer.dispose();
    }
    if (this.outputBuffer !== null) {
      this.outputBuffer.dispose();
    }
    this.deleteDepthTexture();
    this.copyPass.dispose();
    this.timer.dispose();
    Pass.fullscreenGeometry.dispose();
  }
};
var EffectAttribute = {
  NONE: 0,
  DEPTH: 1,
  CONVOLUTION: 2
};
var EffectShaderSection = {
  FRAGMENT_HEAD: "FRAGMENT_HEAD",
  FRAGMENT_MAIN_UV: "FRAGMENT_MAIN_UV",
  FRAGMENT_MAIN_IMAGE: "FRAGMENT_MAIN_IMAGE",
  VERTEX_HEAD: "VERTEX_HEAD",
  VERTEX_MAIN_SUPPORT: "VERTEX_MAIN_SUPPORT"
};
var EffectShaderData = class {
  /**
   * Constructs new shader data.
   */
  constructor() {
    this.shaderParts = /* @__PURE__ */ new Map([
      [EffectShaderSection.FRAGMENT_HEAD, null],
      [EffectShaderSection.FRAGMENT_MAIN_UV, null],
      [EffectShaderSection.FRAGMENT_MAIN_IMAGE, null],
      [EffectShaderSection.VERTEX_HEAD, null],
      [EffectShaderSection.VERTEX_MAIN_SUPPORT, null]
    ]);
    this.defines = /* @__PURE__ */ new Map();
    this.uniforms = /* @__PURE__ */ new Map();
    this.blendModes = /* @__PURE__ */ new Map();
    this.extensions = /* @__PURE__ */ new Set();
    this.attributes = EffectAttribute.NONE;
    this.varyings = /* @__PURE__ */ new Set();
    this.uvTransformation = false;
    this.readDepth = false;
    this.colorSpace = LinearSRGBColorSpace;
  }
};
var workaroundEnabled = false;
var OverrideMaterialManager = class {
  /**
   * Constructs a new override material manager.
   *
   * @param {Material} [material=null] - An override material.
   */
  constructor(material = null) {
    this.originalMaterials = /* @__PURE__ */ new Map();
    this.material = null;
    this.materials = null;
    this.materialsBackSide = null;
    this.materialsDoubleSide = null;
    this.materialsFlatShaded = null;
    this.materialsFlatShadedBackSide = null;
    this.materialsFlatShadedDoubleSide = null;
    this.setMaterial(material);
    this.meshCount = 0;
    this.replaceMaterial = (node) => {
      if (node.isMesh) {
        let materials;
        if (node.material.flatShading) {
          switch (node.material.side) {
            case DoubleSide:
              materials = this.materialsFlatShadedDoubleSide;
              break;
            case BackSide:
              materials = this.materialsFlatShadedBackSide;
              break;
            default:
              materials = this.materialsFlatShaded;
              break;
          }
        } else {
          switch (node.material.side) {
            case DoubleSide:
              materials = this.materialsDoubleSide;
              break;
            case BackSide:
              materials = this.materialsBackSide;
              break;
            default:
              materials = this.materials;
              break;
          }
        }
        this.originalMaterials.set(node, node.material);
        if (node.isSkinnedMesh) {
          node.material = materials[2];
        } else if (node.isInstancedMesh) {
          node.material = materials[1];
        } else {
          node.material = materials[0];
        }
        ++this.meshCount;
      }
    };
  }
  /**
   * Clones the given material.
   *
   * @private
   * @param {Material} material - The material.
   * @return {Material} The cloned material.
   */
  cloneMaterial(material) {
    if (!(material instanceof ShaderMaterial)) {
      return material.clone();
    }
    const uniforms = material.uniforms;
    const textureUniforms = /* @__PURE__ */ new Map();
    for (const key in uniforms) {
      const value = uniforms[key].value;
      if (value.isRenderTargetTexture) {
        uniforms[key].value = null;
        textureUniforms.set(key, value);
      }
    }
    const clone = material.clone();
    for (const entry of textureUniforms) {
      uniforms[entry[0]].value = entry[1];
      clone.uniforms[entry[0]].value = entry[1];
    }
    return clone;
  }
  /**
   * Sets the override material.
   *
   * @param {Material} material - The material.
   */
  setMaterial(material) {
    this.disposeMaterials();
    this.material = material;
    if (material !== null) {
      const materials = this.materials = [
        this.cloneMaterial(material),
        this.cloneMaterial(material),
        this.cloneMaterial(material)
      ];
      for (const m2 of materials) {
        m2.uniforms = Object.assign({}, material.uniforms);
        m2.side = FrontSide;
      }
      materials[2].skinning = true;
      this.materialsBackSide = materials.map((m2) => {
        const c2 = this.cloneMaterial(m2);
        c2.uniforms = Object.assign({}, material.uniforms);
        c2.side = BackSide;
        return c2;
      });
      this.materialsDoubleSide = materials.map((m2) => {
        const c2 = this.cloneMaterial(m2);
        c2.uniforms = Object.assign({}, material.uniforms);
        c2.side = DoubleSide;
        return c2;
      });
      this.materialsFlatShaded = materials.map((m2) => {
        const c2 = this.cloneMaterial(m2);
        c2.uniforms = Object.assign({}, material.uniforms);
        c2.flatShading = true;
        return c2;
      });
      this.materialsFlatShadedBackSide = materials.map((m2) => {
        const c2 = this.cloneMaterial(m2);
        c2.uniforms = Object.assign({}, material.uniforms);
        c2.flatShading = true;
        c2.side = BackSide;
        return c2;
      });
      this.materialsFlatShadedDoubleSide = materials.map((m2) => {
        const c2 = this.cloneMaterial(m2);
        c2.uniforms = Object.assign({}, material.uniforms);
        c2.flatShading = true;
        c2.side = DoubleSide;
        return c2;
      });
    }
  }
  /**
   * Renders the scene with the override material.
   *
   * @private
   * @param {WebGLRenderer} renderer - The renderer.
   * @param {Scene} scene - A scene.
   * @param {Camera} camera - A camera.
   */
  render(renderer, scene, camera) {
    const shadowMapEnabled = renderer.shadowMap.enabled;
    renderer.shadowMap.enabled = false;
    if (workaroundEnabled) {
      const originalMaterials = this.originalMaterials;
      this.meshCount = 0;
      scene.traverse(this.replaceMaterial);
      renderer.render(scene, camera);
      for (const entry of originalMaterials) {
        entry[0].material = entry[1];
      }
      if (this.meshCount !== originalMaterials.size) {
        originalMaterials.clear();
      }
    } else {
      const overrideMaterial = scene.overrideMaterial;
      scene.overrideMaterial = this.material;
      renderer.render(scene, camera);
      scene.overrideMaterial = overrideMaterial;
    }
    renderer.shadowMap.enabled = shadowMapEnabled;
  }
  /**
   * Deletes cloned override materials.
   *
   * @private
   */
  disposeMaterials() {
    if (this.material !== null) {
      const materials = this.materials.concat(this.materialsBackSide).concat(this.materialsDoubleSide).concat(this.materialsFlatShaded).concat(this.materialsFlatShadedBackSide).concat(this.materialsFlatShadedDoubleSide);
      for (const m2 of materials) {
        m2.dispose();
      }
    }
  }
  /**
   * Performs cleanup tasks.
   */
  dispose() {
    this.originalMaterials.clear();
    this.disposeMaterials();
  }
  /**
   * Indicates whether the override material workaround is enabled.
   *
   * @type {Boolean}
   */
  static get workaroundEnabled() {
    return workaroundEnabled;
  }
  /**
   * Enables or disables the override material workaround globally.
   *
   * This only affects post processing passes and effects.
   *
   * @type {Boolean}
   */
  static set workaroundEnabled(value) {
    workaroundEnabled = value;
  }
};
var AUTO_SIZE = -1;
var Resolution = class extends EventDispatcher {
  /**
   * Constructs a new resolution.
   *
   * TODO Remove resizable param.
   * @param {Resizable} resizable - A resizable object.
   * @param {Number} [width=Resolution.AUTO_SIZE] - The preferred width.
   * @param {Number} [height=Resolution.AUTO_SIZE] - The preferred height.
   * @param {Number} [scale=1.0] - A resolution scale.
   */
  constructor(resizable, width = AUTO_SIZE, height = AUTO_SIZE, scale3 = 1) {
    super();
    this.resizable = resizable;
    this.baseSize = new Vector2(1, 1);
    this.preferredSize = new Vector2(width, height);
    this.target = this.preferredSize;
    this.s = scale3;
    this.effectiveSize = new Vector2();
    this.addEventListener("change", () => this.updateEffectiveSize());
    this.updateEffectiveSize();
  }
  /**
   * Calculates the effective size.
   *
   * @private
   */
  updateEffectiveSize() {
    const base = this.baseSize;
    const preferred = this.preferredSize;
    const effective = this.effectiveSize;
    const scale3 = this.scale;
    if (preferred.width !== AUTO_SIZE) {
      effective.width = preferred.width;
    } else if (preferred.height !== AUTO_SIZE) {
      effective.width = Math.round(preferred.height * (base.width / Math.max(base.height, 1)));
    } else {
      effective.width = Math.round(base.width * scale3);
    }
    if (preferred.height !== AUTO_SIZE) {
      effective.height = preferred.height;
    } else if (preferred.width !== AUTO_SIZE) {
      effective.height = Math.round(preferred.width / Math.max(base.width / Math.max(base.height, 1), 1));
    } else {
      effective.height = Math.round(base.height * scale3);
    }
  }
  /**
   * The effective width.
   *
   * If the preferred width and height are set to {@link Resizer.AUTO_SIZE}, the base width will be returned.
   *
   * @type {Number}
   */
  get width() {
    return this.effectiveSize.width;
  }
  set width(value) {
    this.preferredWidth = value;
  }
  /**
   * The effective height.
   *
   * If the preferred width and height are set to {@link Resizer.AUTO_SIZE}, the base height will be returned.
   *
   * @type {Number}
   */
  get height() {
    return this.effectiveSize.height;
  }
  set height(value) {
    this.preferredHeight = value;
  }
  /**
   * Returns the effective width.
   *
   * If the preferred width and height are set to {@link Resizer.AUTO_SIZE}, the base width will be returned.
   *
   * @deprecated Use width instead.
   * @return {Number} The effective width.
   */
  getWidth() {
    return this.width;
  }
  /**
   * Returns the effective height.
   *
   * If the preferred width and height are set to {@link Resizer.AUTO_SIZE}, the base height will be returned.
   *
   * @deprecated Use height instead.
   * @return {Number} The effective height.
   */
  getHeight() {
    return this.height;
  }
  /**
   * The resolution scale.
   *
   * @type {Number}
   */
  get scale() {
    return this.s;
  }
  set scale(value) {
    if (this.s !== value) {
      this.s = value;
      this.preferredSize.setScalar(AUTO_SIZE);
      this.dispatchEvent({ type: "change" });
      this.resizable.setSize(this.baseSize.width, this.baseSize.height);
    }
  }
  /**
   * Returns the current resolution scale.
   *
   * @deprecated Use scale instead.
   * @return {Number} The scale.
   */
  getScale() {
    return this.scale;
  }
  /**
   * Sets the resolution scale.
   *
   * Also sets the preferred resolution to {@link Resizer.AUTO_SIZE}.
   *
   * @deprecated Use scale instead.
   * @param {Number} value - The scale.
   */
  setScale(value) {
    this.scale = value;
  }
  /**
   * The base width.
   *
   * @type {Number}
   */
  get baseWidth() {
    return this.baseSize.width;
  }
  set baseWidth(value) {
    if (this.baseSize.width !== value) {
      this.baseSize.width = value;
      this.dispatchEvent({ type: "change" });
      this.resizable.setSize(this.baseSize.width, this.baseSize.height);
    }
  }
  /**
   * Returns the base width.
   *
   * @deprecated Use baseWidth instead.
   * @return {Number} The base width.
   */
  getBaseWidth() {
    return this.baseWidth;
  }
  /**
   * Sets the base width.
   *
   * @deprecated Use baseWidth instead.
   * @param {Number} value - The width.
   */
  setBaseWidth(value) {
    this.baseWidth = value;
  }
  /**
   * The base height.
   *
   * @type {Number}
   */
  get baseHeight() {
    return this.baseSize.height;
  }
  set baseHeight(value) {
    if (this.baseSize.height !== value) {
      this.baseSize.height = value;
      this.dispatchEvent({ type: "change" });
      this.resizable.setSize(this.baseSize.width, this.baseSize.height);
    }
  }
  /**
   * Returns the base height.
   *
   * @deprecated Use baseHeight instead.
   * @return {Number} The base height.
   */
  getBaseHeight() {
    return this.baseHeight;
  }
  /**
   * Sets the base height.
   *
   * @deprecated Use baseHeight instead.
   * @param {Number} value - The height.
   */
  setBaseHeight(value) {
    this.baseHeight = value;
  }
  /**
   * Sets the base size.
   *
   * @param {Number} width - The width.
   * @param {Number} height - The height.
   */
  setBaseSize(width, height) {
    if (this.baseSize.width !== width || this.baseSize.height !== height) {
      this.baseSize.set(width, height);
      this.dispatchEvent({ type: "change" });
      this.resizable.setSize(this.baseSize.width, this.baseSize.height);
    }
  }
  /**
   * The preferred width.
   *
   * @type {Number}
   */
  get preferredWidth() {
    return this.preferredSize.width;
  }
  set preferredWidth(value) {
    if (this.preferredSize.width !== value) {
      this.preferredSize.width = value;
      this.dispatchEvent({ type: "change" });
      this.resizable.setSize(this.baseSize.width, this.baseSize.height);
    }
  }
  /**
   * Returns the preferred width.
   *
   * @deprecated Use preferredWidth instead.
   * @return {Number} The preferred width.
   */
  getPreferredWidth() {
    return this.preferredWidth;
  }
  /**
   * Sets the preferred width.
   *
   * Use {@link Resizer.AUTO_SIZE} to automatically calculate the width based on the height and aspect ratio.
   *
   * @deprecated Use preferredWidth instead.
   * @param {Number} value - The width.
   */
  setPreferredWidth(value) {
    this.preferredWidth = value;
  }
  /**
   * The preferred height.
   *
   * @type {Number}
   */
  get preferredHeight() {
    return this.preferredSize.height;
  }
  set preferredHeight(value) {
    if (this.preferredSize.height !== value) {
      this.preferredSize.height = value;
      this.dispatchEvent({ type: "change" });
      this.resizable.setSize(this.baseSize.width, this.baseSize.height);
    }
  }
  /**
   * Returns the preferred height.
   *
   * @deprecated Use preferredHeight instead.
   * @return {Number} The preferred height.
   */
  getPreferredHeight() {
    return this.preferredHeight;
  }
  /**
   * Sets the preferred height.
   *
   * Use {@link Resizer.AUTO_SIZE} to automatically calculate the height based on the width and aspect ratio.
   *
   * @deprecated Use preferredHeight instead.
   * @param {Number} value - The height.
   */
  setPreferredHeight(value) {
    this.preferredHeight = value;
  }
  /**
   * Sets the preferred size.
   *
   * @param {Number} width - The width.
   * @param {Number} height - The height.
   */
  setPreferredSize(width, height) {
    if (this.preferredSize.width !== width || this.preferredSize.height !== height) {
      this.preferredSize.set(width, height);
      this.dispatchEvent({ type: "change" });
      this.resizable.setSize(this.baseSize.width, this.baseSize.height);
    }
  }
  /**
   * Copies the given resolution.
   *
   * @param {Resolution} resolution - The resolution.
   */
  copy(resolution) {
    this.s = resolution.scale;
    this.baseSize.set(resolution.baseWidth, resolution.baseHeight);
    this.preferredSize.set(resolution.preferredWidth, resolution.preferredHeight);
    this.dispatchEvent({ type: "change" });
    this.resizable.setSize(this.baseSize.width, this.baseSize.height);
  }
  /**
   * An auto sizing constant.
   *
   * Can be used to automatically calculate the width or height based on the original aspect ratio.
   *
   * @type {Number}
   */
  static get AUTO_SIZE() {
    return AUTO_SIZE;
  }
};
var IdManager = class {
  /**
   * Constructs a new ID manager.
   *
   * @param initialId - The first ID.
   */
  constructor(initialId = 0) {
    this.nextId = initialId;
  }
  /**
   * Returns the next unique ID.
   *
   * @return The ID.
   */
  getNextId() {
    return this.nextId++;
  }
  /**
   * Resets the ID counter.
   *
   * @param initialId - The first ID.
   * @return This manager.
   */
  reset(initialId = 0) {
    this.nextId = initialId;
    return this;
  }
};
var idManager = new IdManager(2);
var Selection = class extends Set {
  /**
   * Constructs a new selection.
   *
   * @param {Iterable<Object3D>} [iterable] - A collection of objects that should be added to this selection.
   * @param {Number} [layer] - A dedicated render layer for selected objects. Range is `[2, 31]`. Starts at 2 if omitted.
   */
  constructor(iterable, layer = idManager.getNextId()) {
    super();
    this.exclusive = false;
    this._layer = layer;
    if (this._layer < 1 || this._layer > 31) {
      console.warn("Layer out of range, resetting to 2");
      idManager.reset(2);
      this._layer = idManager.getNextId();
    }
    if (iterable !== void 0) {
      this.set(iterable);
    }
  }
  /**
   * The render layer for selected objects.
   *
   * @type {Number}
   */
  get layer() {
    return this._layer;
  }
  set layer(value) {
    const currentLayer = this._layer;
    for (const object of this) {
      object.layers.disable(currentLayer);
      object.layers.enable(value);
    }
    this._layer = value;
  }
  /**
   * Returns the current render layer for selected objects.
   *
   * The default layer is 2. If this collides with your own custom layers, please change it before rendering!
   *
   * @deprecated Use layer instead.
   * @return {Number} The layer.
   */
  getLayer() {
    return this.layer;
  }
  /**
   * Sets the render layer for selected objects.
   *
   * The current selection will be updated accordingly.
   *
   * @deprecated Use layer instead.
   * @param {Number} value - The layer. Range is [0, 31].
   */
  setLayer(value) {
    this.layer = value;
  }
  /**
   * Indicates whether objects that are added to this selection will be removed from all other layers.
   *
   * @deprecated Use exclusive instead.
   * @return {Number} Whether this selection is exclusive. Default is false.
   */
  isExclusive() {
    return this.exclusive;
  }
  /**
   * Controls whether objects that are added to this selection should be removed from all other layers.
   *
   * @deprecated Use exclusive instead.
   * @param {Number} value - Whether this selection should be exclusive.
   */
  setExclusive(value) {
    this.exclusive = value;
  }
  /**
   * Clears this selection.
   *
   * @return {Selection} This selection.
   */
  clear() {
    const layer = this.layer;
    for (const object of this) {
      object.layers.disable(layer);
    }
    return super.clear();
  }
  /**
   * Clears this selection and adds the given objects.
   *
   * @param {Iterable<Object3D>} objects - The objects that should be selected.
   * @return {Selection} This selection.
   */
  set(objects) {
    this.clear();
    for (const object of objects) {
      this.add(object);
    }
    return this;
  }
  /**
   * An alias for {@link has}.
   *
   * @param {Object3D} object - An object.
   * @return {Number} Returns 0 if the given object is currently selected, or -1 otherwise.
   * @deprecated Added for backward-compatibility.
   */
  indexOf(object) {
    return this.has(object) ? 0 : -1;
  }
  /**
   * Adds an object to this selection.
   *
   * If {@link exclusive} is set to `true`, the object will also be removed from all other layers.
   *
   * @param {Object3D} object - The object that should be selected.
   * @return {Selection} This selection.
   */
  add(object) {
    if (this.exclusive) {
      object.layers.set(this.layer);
    } else {
      object.layers.enable(this.layer);
    }
    return super.add(object);
  }
  /**
   * Removes an object from this selection.
   *
   * @param {Object3D} object - The object that should be deselected.
   * @return {Boolean} Returns true if an object has successfully been removed from this selection; otherwise false.
   */
  delete(object) {
    if (this.has(object)) {
      object.layers.disable(this.layer);
    }
    return super.delete(object);
  }
  /**
   * Removes an existing object from the selection. If the object doesn't exist it's added instead.
   *
   * @param {Object3D} object - The object.
   * @return {Boolean} Returns true if the object is added, false otherwise.
   */
  toggle(object) {
    let result;
    if (this.has(object)) {
      this.delete(object);
      result = false;
    } else {
      this.add(object);
      result = true;
    }
    return result;
  }
  /**
   * Sets the visibility of all selected objects.
   *
   * This method enables or disables render layer 0 of all selected objects.
   *
   * @param {Boolean} visible - Whether the selected objects should be visible.
   * @return {Selection} This selection.
   */
  setVisible(visible) {
    for (const object of this) {
      if (visible) {
        object.layers.enable(0);
      } else {
        object.layers.disable(0);
      }
    }
    return this;
  }
};
var BlendFunction = {
  SKIP: 9,
  SET: 30,
  ADD: 0,
  ALPHA: 1,
  AVERAGE: 2,
  COLOR: 3,
  COLOR_BURN: 4,
  COLOR_DODGE: 5,
  DARKEN: 6,
  DIFFERENCE: 7,
  DIVIDE: 8,
  DST: 9,
  EXCLUSION: 10,
  HARD_LIGHT: 11,
  HARD_MIX: 12,
  HUE: 13,
  INVERT: 14,
  INVERT_RGB: 15,
  LIGHTEN: 16,
  LINEAR_BURN: 17,
  LINEAR_DODGE: 18,
  LINEAR_LIGHT: 19,
  LUMINOSITY: 20,
  MULTIPLY: 21,
  NEGATION: 22,
  NORMAL: 23,
  OVERLAY: 24,
  PIN_LIGHT: 25,
  REFLECT: 26,
  SATURATION: 27,
  SCREEN: 28,
  SOFT_LIGHT: 29,
  SRC: 30,
  SUBTRACT: 31,
  VIVID_LIGHT: 32
};
var add_default = `vec4 blend(const in vec4 x,const in vec4 y,const in float opacity){return mix(x,vec4(x.rgb+y.rgb,y.a),opacity);}`;
var alpha_default = `vec4 blend(const in vec4 x,const in vec4 y,const in float opacity){return mix(x,y,y.a*opacity);}`;
var average_default = `vec4 blend(const in vec4 x,const in vec4 y,const in float opacity){return mix(x,vec4((x.rgb+y.rgb)*0.5,y.a),opacity);}`;
var color_default = `vec4 blend(const in vec4 x,const in vec4 y,const in float opacity){vec3 xHSL=RGBToHSL(x.rgb);vec3 yHSL=RGBToHSL(y.rgb);vec3 z=HSLToRGB(vec3(yHSL.xy,xHSL.z));return mix(x,vec4(z,y.a),opacity);}`;
var color_burn_default = `vec4 blend(const in vec4 x,const in vec4 y,const in float opacity){vec3 a=x.rgb,b=y.rgb;vec3 z=mix(step(0.0,b)*(1.0-min(vec3(1.0),(1.0-a)/b)),vec3(1.0),step(1.0,a));return mix(x,vec4(z,y.a),opacity);}`;
var color_dodge_default = `vec4 blend(const in vec4 x,const in vec4 y,const in float opacity){vec3 a=x.rgb,b=y.rgb;vec3 z=step(0.0,a)*mix(min(vec3(1.0),a/max(1.0-b,1e-9)),vec3(1.0),step(1.0,b));return mix(x,vec4(z,y.a),opacity);}`;
var darken_default = `vec4 blend(const in vec4 x,const in vec4 y,const in float opacity){return mix(x,vec4(min(x.rgb,y.rgb),y.a),opacity);}`;
var difference_default = `vec4 blend(const in vec4 x,const in vec4 y,const in float opacity){return mix(x,vec4(abs(x.rgb-y.rgb),y.a),opacity);}`;
var divide_default = `vec4 blend(const in vec4 x,const in vec4 y,const in float opacity){return mix(x,vec4(x.rgb/max(y.rgb,1e-12),y.a),opacity);}`;
var exclusion_default = `vec4 blend(const in vec4 x,const in vec4 y,const in float opacity){return mix(x,vec4((x.rgb+y.rgb-2.0*x.rgb*y.rgb),y.a),opacity);}`;
var hard_light_default = `vec4 blend(const in vec4 x,const in vec4 y,const in float opacity){vec3 a=min(x.rgb,1.0);vec3 b=min(y.rgb,1.0);vec3 z=mix(2.0*a*b,1.0-2.0*(1.0-a)*(1.0-b),step(0.5,b));return mix(x,vec4(z,y.a),opacity);}`;
var hard_mix_default = `vec4 blend(const in vec4 x,const in vec4 y,const in float opacity){return mix(x,vec4(step(1.0,x.rgb+y.rgb),y.a),opacity);}`;
var hue_default = `vec4 blend(const in vec4 x,const in vec4 y,const in float opacity){vec3 xHSL=RGBToHSL(x.rgb);vec3 yHSL=RGBToHSL(y.rgb);vec3 z=HSLToRGB(vec3(yHSL.x,xHSL.yz));return mix(x,vec4(z,y.a),opacity);}`;
var invert_default = `vec4 blend(const in vec4 x,const in vec4 y,const in float opacity){return mix(x,vec4(1.0-y.rgb,y.a),opacity);}`;
var invert_rgb_default = `vec4 blend(const in vec4 x,const in vec4 y,const in float opacity){return mix(x,vec4(y.rgb*(1.0-x.rgb),y.a),opacity);}`;
var lighten_default = `vec4 blend(const in vec4 x,const in vec4 y,const in float opacity){return mix(x,vec4(max(x.rgb,y.rgb),y.a),opacity);}`;
var linear_burn_default = `vec4 blend(const in vec4 x,const in vec4 y,const in float opacity){return mix(x,vec4(clamp(y.rgb+x.rgb-1.0,0.0,1.0),y.a),opacity);}`;
var linear_dodge_default = `vec4 blend(const in vec4 x,const in vec4 y,const in float opacity){return mix(x,vec4(min(x.rgb+y.rgb,1.0),y.a),opacity);}`;
var linear_light_default = `vec4 blend(const in vec4 x,const in vec4 y,const in float opacity){return mix(x,vec4(clamp(2.0*y.rgb+x.rgb-1.0,0.0,1.0),y.a),opacity);}`;
var luminosity_default = `vec4 blend(const in vec4 x,const in vec4 y,const in float opacity){vec3 xHSL=RGBToHSL(x.rgb);vec3 yHSL=RGBToHSL(y.rgb);vec3 z=HSLToRGB(vec3(xHSL.xy,yHSL.z));return mix(x,vec4(z,y.a),opacity);}`;
var multiply_default = `vec4 blend(const in vec4 x,const in vec4 y,const in float opacity){return mix(x,vec4(x.rgb*y.rgb,y.a),opacity);}`;
var negation_default = `vec4 blend(const in vec4 x,const in vec4 y,const in float opacity){return mix(x,vec4(1.0-abs(1.0-x.rgb-y.rgb),y.a),opacity);}`;
var normal_default = `vec4 blend(const in vec4 x,const in vec4 y,const in float opacity){return mix(x,y,opacity);}`;
var overlay_default = `vec4 blend(const in vec4 x,const in vec4 y,const in float opacity){vec3 z=mix(2.0*y.rgb*x.rgb,1.0-2.0*(1.0-y.rgb)*(1.0-x.rgb),step(0.5,x.rgb));return mix(x,vec4(z,y.a),opacity);}`;
var pin_light_default = `vec4 blend(const in vec4 x,const in vec4 y,const in float opacity){vec3 y2=2.0*y.rgb;vec3 z=mix(mix(y2,x.rgb,step(0.5*x.rgb,y.rgb)),max(y2-1.0,vec3(0.0)),step(x.rgb,y2-1.0));return mix(x,vec4(z,y.a),opacity);}`;
var reflect_default = `vec4 blend(const in vec4 x,const in vec4 y,const in float opacity){vec3 z=mix(min(x.rgb*x.rgb/max(1.0-y.rgb,1e-12),1.0),y.rgb,step(1.0,y.rgb));return mix(x,vec4(z,y.a),opacity);}`;
var saturation_default = `vec4 blend(const in vec4 x,const in vec4 y,const in float opacity){vec3 xHSL=RGBToHSL(x.rgb);vec3 yHSL=RGBToHSL(y.rgb);vec3 z=HSLToRGB(vec3(xHSL.x,yHSL.y,xHSL.z));return mix(x,vec4(z,y.a),opacity);}`;
var screen_default = `vec4 blend(const in vec4 x,const in vec4 y,const in float opacity){return mix(x,vec4(x.rgb+y.rgb-min(x.rgb*y.rgb,1.0),y.a),opacity);}`;
var soft_light_default = `vec4 blend(const in vec4 x,const in vec4 y,const in float opacity){vec3 a=x.rgb;vec3 b=y.rgb;vec3 y2=2.0*b;vec3 w=step(0.5,b);vec3 c=a-(1.0-y2)*a*(1.0-a);vec3 d=mix(a+(y2-1.0)*(sqrt(a)-a),a+(y2-1.0)*a*((16.0*a-12.0)*a+3.0),w*(1.0-step(0.25,a)));vec3 z=mix(c,d,w);return mix(x,vec4(z,y.a),opacity);}`;
var src_default = `vec4 blend(const in vec4 x,const in vec4 y,const in float opacity){return y;}`;
var subtract_default = `vec4 blend(const in vec4 x,const in vec4 y,const in float opacity){return mix(x,vec4(max(x.rgb+y.rgb-1.0,0.0),y.a),opacity);}`;
var vivid_light_default = `vec4 blend(const in vec4 x,const in vec4 y,const in float opacity){vec3 z=mix(max(1.0-min((1.0-x.rgb)/(2.0*y.rgb),1.0),0.0),min(x.rgb/(2.0*(1.0-y.rgb)),1.0),step(0.5,y.rgb));return mix(x,vec4(z,y.a),opacity);}`;
var blendFunctions = /* @__PURE__ */ new Map([
  [BlendFunction.ADD, add_default],
  [BlendFunction.ALPHA, alpha_default],
  [BlendFunction.AVERAGE, average_default],
  [BlendFunction.COLOR, color_default],
  [BlendFunction.COLOR_BURN, color_burn_default],
  [BlendFunction.COLOR_DODGE, color_dodge_default],
  [BlendFunction.DARKEN, darken_default],
  [BlendFunction.DIFFERENCE, difference_default],
  [BlendFunction.DIVIDE, divide_default],
  [BlendFunction.DST, null],
  [BlendFunction.EXCLUSION, exclusion_default],
  [BlendFunction.HARD_LIGHT, hard_light_default],
  [BlendFunction.HARD_MIX, hard_mix_default],
  [BlendFunction.HUE, hue_default],
  [BlendFunction.INVERT, invert_default],
  [BlendFunction.INVERT_RGB, invert_rgb_default],
  [BlendFunction.LIGHTEN, lighten_default],
  [BlendFunction.LINEAR_BURN, linear_burn_default],
  [BlendFunction.LINEAR_DODGE, linear_dodge_default],
  [BlendFunction.LINEAR_LIGHT, linear_light_default],
  [BlendFunction.LUMINOSITY, luminosity_default],
  [BlendFunction.MULTIPLY, multiply_default],
  [BlendFunction.NEGATION, negation_default],
  [BlendFunction.NORMAL, normal_default],
  [BlendFunction.OVERLAY, overlay_default],
  [BlendFunction.PIN_LIGHT, pin_light_default],
  [BlendFunction.REFLECT, reflect_default],
  [BlendFunction.SATURATION, saturation_default],
  [BlendFunction.SCREEN, screen_default],
  [BlendFunction.SOFT_LIGHT, soft_light_default],
  [BlendFunction.SRC, src_default],
  [BlendFunction.SUBTRACT, subtract_default],
  [BlendFunction.VIVID_LIGHT, vivid_light_default]
]);
var BlendMode = class extends EventDispatcher {
  /**
   * Constructs a new blend mode.
   *
   * @param {BlendFunction} blendFunction - The blend function.
   * @param {Number} opacity - The opacity of the color that will be blended with the base color.
   */
  constructor(blendFunction, opacity = 1) {
    super();
    this._blendFunction = blendFunction;
    this.opacity = new Uniform(opacity);
  }
  /**
   * Returns the opacity.
   *
   * @return {Number} The opacity.
   */
  getOpacity() {
    return this.opacity.value;
  }
  /**
   * Sets the opacity.
   *
   * @param {Number} value - The opacity.
   */
  setOpacity(value) {
    this.opacity.value = value;
  }
  /**
   * The blend function.
   *
   * @type {BlendFunction}
   */
  get blendFunction() {
    return this._blendFunction;
  }
  set blendFunction(value) {
    this._blendFunction = value;
    this.dispatchEvent({ type: "change" });
  }
  /**
   * Returns the blend function.
   *
   * @deprecated Use blendFunction instead.
   * @return {BlendFunction} The blend function.
   */
  getBlendFunction() {
    return this.blendFunction;
  }
  /**
   * Sets the blend function.
   *
   * @deprecated Use blendFunction instead.
   * @param {BlendFunction} value - The blend function.
   */
  setBlendFunction(value) {
    this.blendFunction = value;
  }
  /**
   * Returns the blend function shader code.
   *
   * @return {String} The blend function shader code.
   */
  getShaderCode() {
    return blendFunctions.get(this.blendFunction);
  }
};
var Effect = class extends EventDispatcher {
  /**
   * Constructs a new effect.
   *
   * @param {String} name - The name of this effect. Doesn't have to be unique.
   * @param {String} fragmentShader - The fragment shader. This shader is required.
   * @param {Object} [options] - Additional options.
   * @param {EffectAttribute} [options.attributes=EffectAttribute.NONE] - The effect attributes that determine the execution priority and resource requirements.
   * @param {BlendFunction} [options.blendFunction=BlendFunction.NORMAL] - The blend function of this effect.
   * @param {Map<String, String>} [options.defines] - Custom preprocessor macro definitions. Keys are names and values are code.
   * @param {Map<String, Uniform>} [options.uniforms] - Custom shader uniforms. Keys are names and values are uniforms.
   * @param {Set<WebGLExtension>} [options.extensions] - WebGL extensions.
   * @param {String} [options.vertexShader=null] - The vertex shader. Most effects don't need one.
   */
  constructor(name, fragmentShader, {
    attributes = EffectAttribute.NONE,
    blendFunction = BlendFunction.NORMAL,
    defines = /* @__PURE__ */ new Map(),
    uniforms = /* @__PURE__ */ new Map(),
    extensions = null,
    vertexShader = null
  } = {}) {
    super();
    this.name = name;
    this.renderer = null;
    this.attributes = attributes;
    this.fragmentShader = fragmentShader;
    this.vertexShader = vertexShader;
    this.defines = defines;
    this.uniforms = uniforms;
    this.extensions = extensions;
    this.blendMode = new BlendMode(blendFunction);
    this.blendMode.addEventListener("change", (event) => this.setChanged());
    this._inputColorSpace = LinearSRGBColorSpace;
    this._outputColorSpace = NoColorSpace;
  }
  /**
   * The input color space.
   *
   * @type {ColorSpace}
   * @experimental
   */
  get inputColorSpace() {
    return this._inputColorSpace;
  }
  /**
   * @type {ColorSpace}
   * @protected
   * @experimental
   */
  set inputColorSpace(value) {
    this._inputColorSpace = value;
    this.setChanged();
  }
  /**
   * The output color space.
   *
   * Should only be changed if this effect converts the input colors to a different color space.
   *
   * @type {ColorSpace}
   * @experimental
   */
  get outputColorSpace() {
    return this._outputColorSpace;
  }
  /**
   * @type {ColorSpace}
   * @protected
   * @experimental
   */
  set outputColorSpace(value) {
    this._outputColorSpace = value;
    this.setChanged();
  }
  /**
   * Sets the main scene.
   *
   * @type {Scene}
   */
  set mainScene(value) {
  }
  /**
   * Sets the main camera.
   *
   * @type {Camera}
   */
  set mainCamera(value) {
  }
  /**
   * Returns the name of this effect.
   *
   * @deprecated Use name instead.
   * @return {String} The name.
   */
  getName() {
    return this.name;
  }
  /**
   * Sets the renderer.
   *
   * @deprecated
   * @param {WebGLRenderer} renderer - The renderer.
   */
  setRenderer(renderer) {
    this.renderer = renderer;
  }
  /**
   * Returns the preprocessor macro definitions.
   *
   * @deprecated Use defines instead.
   * @return {Map<String, String>} The extensions.
   */
  getDefines() {
    return this.defines;
  }
  /**
   * Returns the uniforms of this effect.
   *
   * @deprecated Use uniforms instead.
   * @return {Map<String, Uniform>} The extensions.
   */
  getUniforms() {
    return this.uniforms;
  }
  /**
   * Returns the WebGL extensions that are required by this effect.
   *
   * @deprecated Use extensions instead.
   * @return {Set<WebGLExtension>} The extensions.
   */
  getExtensions() {
    return this.extensions;
  }
  /**
   * Returns the blend mode.
   *
   * The result of this effect will be blended with the result of the previous effect using this blend mode.
   *
   * @deprecated Use blendMode instead.
   * @return {BlendMode} The blend mode.
   */
  getBlendMode() {
    return this.blendMode;
  }
  /**
   * Returns the effect attributes.
   *
   * @return {EffectAttribute} The attributes.
   */
  getAttributes() {
    return this.attributes;
  }
  /**
   * Sets the effect attributes.
   *
   * Effects that have the same attributes will be executed in the order in which they were registered. Some attributes
   * imply a higher priority.
   *
   * @protected
   * @param {EffectAttribute} attributes - The attributes.
   */
  setAttributes(attributes) {
    this.attributes = attributes;
    this.setChanged();
  }
  /**
   * Returns the fragment shader.
   *
   * @return {String} The fragment shader.
   */
  getFragmentShader() {
    return this.fragmentShader;
  }
  /**
   * Sets the fragment shader.
   *
   * @protected
   * @param {String} fragmentShader - The fragment shader.
   */
  setFragmentShader(fragmentShader) {
    this.fragmentShader = fragmentShader;
    this.setChanged();
  }
  /**
   * Returns the vertex shader.
   *
   * @return {String} The vertex shader.
   */
  getVertexShader() {
    return this.vertexShader;
  }
  /**
   * Sets the vertex shader.
   *
   * @protected
   * @param {String} vertexShader - The vertex shader.
   */
  setVertexShader(vertexShader) {
    this.vertexShader = vertexShader;
    this.setChanged();
  }
  /**
   * Informs the associated {@link EffectPass} that this effect requires a shader recompilation.
   *
   * Should be called after changing macros or extensions and after adding/removing uniforms.
   *
   * @protected
   */
  setChanged() {
    this.dispatchEvent({ type: "change" });
  }
  /**
   * Sets the depth texture.
   *
   * You may override this method if your effect requires direct access to the depth texture that is bound to the
   * associated {@link EffectPass}.
   *
   * @param {Texture} depthTexture - A depth texture.
   * @param {DepthPackingStrategies} [depthPacking=BasicDepthPacking] - The depth packing.
   */
  setDepthTexture(depthTexture, depthPacking = BasicDepthPacking) {
  }
  /**
   * Updates this effect by performing supporting operations.
   *
   * This method is called by the {@link EffectPass} right before the main fullscreen render operation, even if the
   * blend function is set to `SKIP`.
   *
   * You may override this method if you need to update custom uniforms or render additional off-screen textures.
   *
   * @param {WebGLRenderer} renderer - The renderer.
   * @param {WebGLRenderTarget} inputBuffer - A frame buffer that contains the result of the previous pass.
   * @param {Number} [deltaTime] - The time between the last frame and the current one in seconds.
   */
  update(renderer, inputBuffer, deltaTime) {
  }
  /**
   * Updates the size of this effect.
   *
   * You may override this method if you want to be informed about the size of the backbuffer/canvas.
   * This method is called before {@link initialize} and every time the size of the {@link EffectComposer} changes.
   *
   * @param {Number} width - The width.
   * @param {Number} height - The height.
   */
  setSize(width, height) {
  }
  /**
   * Performs initialization tasks.
   *
   * This method is called when the associated {@link EffectPass} is added to an {@link EffectComposer}.
   *
   * @param {WebGLRenderer} renderer - The renderer.
   * @param {Boolean} alpha - Whether the renderer uses the alpha channel or not.
   * @param {Number} frameBufferType - The type of the main frame buffers.
   * @example if(!alpha && frameBufferType === UnsignedByteType) { this.myRenderTarget.texture.format = RGBFormat; }
   */
  initialize(renderer, alpha, frameBufferType) {
  }
  /**
   * Performs a shallow search for properties that define a dispose method and deletes them.
   *
   * The {@link EffectComposer} calls this method when it is being destroyed.
   */
  dispose() {
    for (const key of Object.keys(this)) {
      const property = this[key];
      const isDisposable = property instanceof WebGLRenderTarget || property instanceof Material || property instanceof Texture || property instanceof Pass;
      if (isDisposable) {
        this[key].dispose();
      }
    }
  }
};
var KernelSize = {
  VERY_SMALL: 0,
  SMALL: 1,
  MEDIUM: 2,
  LARGE: 3,
  VERY_LARGE: 4,
  HUGE: 5
};
var convolution_kawase_default = `#ifdef FRAMEBUFFER_PRECISION_HIGH
uniform mediump sampler2D inputBuffer;
#else
uniform lowp sampler2D inputBuffer;
#endif
varying vec2 vUv0;varying vec2 vUv1;varying vec2 vUv2;varying vec2 vUv3;void main(){vec4 sum=texture2D(inputBuffer,vUv0);sum+=texture2D(inputBuffer,vUv1);sum+=texture2D(inputBuffer,vUv2);sum+=texture2D(inputBuffer,vUv3);gl_FragColor=sum*0.25;
#include <colorspace_fragment>
}`;
var convolution_kawase_default2 = `uniform vec4 texelSize;uniform float kernel;uniform float scale;varying vec2 vUv0;varying vec2 vUv1;varying vec2 vUv2;varying vec2 vUv3;void main(){vec2 uv=position.xy*0.5+0.5;vec2 dUv=(texelSize.xy*vec2(kernel)+texelSize.zw)*scale;vUv0=vec2(uv.x-dUv.x,uv.y+dUv.y);vUv1=vec2(uv.x+dUv.x,uv.y+dUv.y);vUv2=vec2(uv.x+dUv.x,uv.y-dUv.y);vUv3=vec2(uv.x-dUv.x,uv.y-dUv.y);gl_Position=vec4(position.xy,1.0,1.0);}`;
var kernelPresets = [
  new Float32Array([0, 0]),
  new Float32Array([0, 1, 1]),
  new Float32Array([0, 1, 1, 2]),
  new Float32Array([0, 1, 2, 2, 3]),
  new Float32Array([0, 1, 2, 3, 4, 4, 5]),
  new Float32Array([0, 1, 2, 3, 4, 5, 7, 8, 9, 10])
];
var KawaseBlurMaterial = class extends ShaderMaterial {
  /**
   * Constructs a new convolution material.
   *
   * TODO Remove texelSize param.
   * @param {Vector4} [texelSize] - Deprecated.
   */
  constructor(texelSize = new Vector4()) {
    super({
      name: "KawaseBlurMaterial",
      uniforms: {
        inputBuffer: new Uniform(null),
        texelSize: new Uniform(new Vector4()),
        scale: new Uniform(1),
        kernel: new Uniform(0)
      },
      blending: NoBlending,
      toneMapped: false,
      depthWrite: false,
      depthTest: false,
      fragmentShader: convolution_kawase_default,
      vertexShader: convolution_kawase_default2
    });
    this.setTexelSize(texelSize.x, texelSize.y);
    this.kernelSize = KernelSize.MEDIUM;
  }
  /**
   * The input buffer.
   *
   * @type {Texture}
   */
  set inputBuffer(value) {
    this.uniforms.inputBuffer.value = value;
  }
  /**
   * Sets the input buffer.
   *
   * @deprecated Use inputBuffer instead.
   * @param {Texture} value - The input buffer.
   */
  setInputBuffer(value) {
    this.inputBuffer = value;
  }
  /**
   * The kernel sequence for the current kernel size.
   *
   * @type {Float32Array}
   */
  get kernelSequence() {
    return kernelPresets[this.kernelSize];
  }
  /**
   * The blur scale.
   *
   * @type {Number}
   */
  get scale() {
    return this.uniforms.scale.value;
  }
  set scale(value) {
    this.uniforms.scale.value = value;
  }
  /**
   * Returns the blur scale.
   *
   * @deprecated Use scale instead.
   * @return {Number} The scale.
   */
  getScale() {
    return this.uniforms.scale.value;
  }
  /**
   * Sets the blur scale.
   *
   * @deprecated Use scale instead.
   * @return {Number} value - The scale.
   */
  setScale(value) {
    this.uniforms.scale.value = value;
  }
  /**
   * Returns the kernel.
   *
   * @return {Float32Array} The kernel.
   * @deprecated Implementation detail, removed with no replacement.
   */
  getKernel() {
    return null;
  }
  /**
   * The current kernel.
   *
   * @type {Number}
   */
  get kernel() {
    return this.uniforms.kernel.value;
  }
  set kernel(value) {
    this.uniforms.kernel.value = value;
  }
  /**
   * Sets the current kernel.
   *
   * @deprecated Use kernel instead.
   * @param {Number} value - The kernel.
   */
  setKernel(value) {
    this.kernel = value;
  }
  /**
   * Sets the texel size.
   *
   * @deprecated Use setSize() instead.
   * @param {Number} x - The texel width.
   * @param {Number} y - The texel height.
   */
  setTexelSize(x, y) {
    this.uniforms.texelSize.value.set(x, y, x * 0.5, y * 0.5);
  }
  /**
   * Sets the size of this object.
   *
   * @param {Number} width - The width.
   * @param {Number} height - The height.
   */
  setSize(width, height) {
    const x = 1 / width, y = 1 / height;
    this.uniforms.texelSize.value.set(x, y, x * 0.5, y * 0.5);
  }
};
var KawaseBlurPass = class extends Pass {
  /**
   * Constructs a new Kawase blur pass.
   *
   * @param {Object} [options] - The options.
   * @param {KernelSize} [options.kernelSize=KernelSize.MEDIUM] - The blur kernel size.
   * @param {Number} [options.resolutionScale=0.5] - The resolution scale.
   * @param {Number} [options.resolutionX=Resolution.AUTO_SIZE] - The horizontal resolution.
   * @param {Number} [options.resolutionY=Resolution.AUTO_SIZE] - The vertical resolution.
   * @param {Number} [options.width=Resolution.AUTO_SIZE] - Deprecated. Use resolutionX instead.
   * @param {Number} [options.height=Resolution.AUTO_SIZE] - Deprecated. Use resolutionY instead.
   */
  constructor({
    kernelSize = KernelSize.MEDIUM,
    resolutionScale = 0.5,
    width = Resolution.AUTO_SIZE,
    height = Resolution.AUTO_SIZE,
    resolutionX = width,
    resolutionY = height
  } = {}) {
    super("KawaseBlurPass");
    this.renderTargetA = new WebGLRenderTarget(1, 1, { depthBuffer: false });
    this.renderTargetA.texture.name = "Blur.Target.A";
    this.renderTargetB = this.renderTargetA.clone();
    this.renderTargetB.texture.name = "Blur.Target.B";
    const resolution = this.resolution = new Resolution(this, resolutionX, resolutionY, resolutionScale);
    resolution.addEventListener("change", (e) => this.setSize(resolution.baseWidth, resolution.baseHeight));
    this._blurMaterial = new KawaseBlurMaterial();
    this._blurMaterial.kernelSize = kernelSize;
    this.copyMaterial = new CopyMaterial();
  }
  /**
   * Returns the resolution settings.
   *
   * @deprecated Use resolution instead.
   * @return {Resolution} The resolution.
   */
  getResolution() {
    return this.resolution;
  }
  /**
   * The blur material.
   *
   * @type {KawaseBlurMaterial}
   */
  get blurMaterial() {
    return this._blurMaterial;
  }
  /**
   * The blur material.
   *
   * @type {KawaseBlurMaterial}
   * @protected
   */
  set blurMaterial(value) {
    this._blurMaterial = value;
  }
  /**
   * Indicates whether dithering is enabled.
   *
   * @type {Boolean}
   * @deprecated Use copyMaterial.dithering instead.
   */
  get dithering() {
    return this.copyMaterial.dithering;
  }
  set dithering(value) {
    this.copyMaterial.dithering = value;
  }
  /**
   * The kernel size.
   *
   * @type {KernelSize}
   * @deprecated Use blurMaterial.kernelSize instead.
   */
  get kernelSize() {
    return this.blurMaterial.kernelSize;
  }
  set kernelSize(value) {
    this.blurMaterial.kernelSize = value;
  }
  /**
   * The current width of the internal render targets.
   *
   * @type {Number}
   * @deprecated Use resolution.width instead.
   */
  get width() {
    return this.resolution.width;
  }
  /**
   * Sets the render width.
   *
   * @type {Number}
   * @deprecated Use resolution.preferredWidth instead.
   */
  set width(value) {
    this.resolution.preferredWidth = value;
  }
  /**
   * The current height of the internal render targets.
   *
   * @type {Number}
   * @deprecated Use resolution.height instead.
   */
  get height() {
    return this.resolution.height;
  }
  /**
   * Sets the render height.
   *
   * @type {Number}
   * @deprecated Use resolution.preferredHeight instead.
   */
  set height(value) {
    this.resolution.preferredHeight = value;
  }
  /**
   * The current blur scale.
   *
   * @type {Number}
   * @deprecated Use blurMaterial.scale instead.
   */
  get scale() {
    return this.blurMaterial.scale;
  }
  set scale(value) {
    this.blurMaterial.scale = value;
  }
  /**
   * Returns the current blur scale.
   *
   * @deprecated Use blurMaterial.scale instead.
   * @return {Number} The scale.
   */
  getScale() {
    return this.blurMaterial.scale;
  }
  /**
   * Sets the blur scale.
   *
   * @deprecated Use blurMaterial.scale instead.
   * @param {Number} value - The scale.
   */
  setScale(value) {
    this.blurMaterial.scale = value;
  }
  /**
   * Returns the kernel size.
   *
   * @deprecated Use blurMaterial.kernelSize instead.
   * @return {KernelSize} The kernel size.
   */
  getKernelSize() {
    return this.kernelSize;
  }
  /**
   * Sets the kernel size.
   *
   * Larger kernels require more processing power but scale well with larger render resolutions.
   *
   * @deprecated Use blurMaterial.kernelSize instead.
   * @param {KernelSize} value - The kernel size.
   */
  setKernelSize(value) {
    this.kernelSize = value;
  }
  /**
   * Returns the current resolution scale.
   *
   * @return {Number} The resolution scale.
   * @deprecated Use resolution instead.
   */
  getResolutionScale() {
    return this.resolution.scale;
  }
  /**
   * Sets the resolution scale.
   *
   * @param {Number} scale - The new resolution scale.
   * @deprecated Use resolution instead.
   */
  setResolutionScale(scale3) {
    this.resolution.scale = scale3;
  }
  /**
   * Renders the blur.
   *
   * @param {WebGLRenderer} renderer - The renderer.
   * @param {WebGLRenderTarget} inputBuffer - A frame buffer that contains the result of the previous pass.
   * @param {WebGLRenderTarget} outputBuffer - A frame buffer that serves as the output render target unless this pass renders to screen.
   * @param {Number} [deltaTime] - The time between the last frame and the current one in seconds.
   * @param {Boolean} [stencilTest] - Indicates whether a stencil mask is active.
   */
  render(renderer, inputBuffer, outputBuffer, deltaTime, stencilTest) {
    const scene = this.scene;
    const camera = this.camera;
    const renderTargetA = this.renderTargetA;
    const renderTargetB = this.renderTargetB;
    const material = this.blurMaterial;
    const kernelSequence = material.kernelSequence;
    let previousBuffer = inputBuffer;
    this.fullscreenMaterial = material;
    for (let i = 0, l = kernelSequence.length; i < l; ++i) {
      const buffer2 = (i & 1) === 0 ? renderTargetA : renderTargetB;
      material.kernel = kernelSequence[i];
      material.inputBuffer = previousBuffer.texture;
      renderer.setRenderTarget(buffer2);
      renderer.render(scene, camera);
      previousBuffer = buffer2;
    }
    this.fullscreenMaterial = this.copyMaterial;
    this.copyMaterial.inputBuffer = previousBuffer.texture;
    renderer.setRenderTarget(this.renderToScreen ? null : outputBuffer);
    renderer.render(scene, camera);
  }
  /**
   * Updates the size of this pass.
   *
   * @param {Number} width - The width.
   * @param {Number} height - The height.
   */
  setSize(width, height) {
    const resolution = this.resolution;
    resolution.setBaseSize(width, height);
    const w2 = resolution.width, h = resolution.height;
    this.renderTargetA.setSize(w2, h);
    this.renderTargetB.setSize(w2, h);
    this.blurMaterial.setSize(width, height);
  }
  /**
   * Performs initialization tasks.
   *
   * @param {WebGLRenderer} renderer - The renderer.
   * @param {Boolean} alpha - Whether the renderer uses the alpha channel or not.
   * @param {Number} frameBufferType - The type of the main frame buffers.
   */
  initialize(renderer, alpha, frameBufferType) {
    if (frameBufferType !== void 0) {
      this.renderTargetA.texture.type = frameBufferType;
      this.renderTargetB.texture.type = frameBufferType;
      if (frameBufferType !== UnsignedByteType) {
        this.blurMaterial.defines.FRAMEBUFFER_PRECISION_HIGH = "1";
        this.copyMaterial.defines.FRAMEBUFFER_PRECISION_HIGH = "1";
      } else if (renderer !== null && renderer.outputColorSpace === SRGBColorSpace) {
        this.renderTargetA.texture.colorSpace = SRGBColorSpace;
        this.renderTargetB.texture.colorSpace = SRGBColorSpace;
      }
    }
  }
  /**
   * An auto sizing flag.
   *
   * @type {Number}
   * @deprecated Use {@link Resolution.AUTO_SIZE} instead.
   */
  static get AUTO_SIZE() {
    return Resolution.AUTO_SIZE;
  }
};
var luminance_default = `#include <common>
#ifdef FRAMEBUFFER_PRECISION_HIGH
uniform mediump sampler2D inputBuffer;
#else
uniform lowp sampler2D inputBuffer;
#endif
#ifdef RANGE
uniform vec2 range;
#elif defined(THRESHOLD)
uniform float threshold;uniform float smoothing;
#endif
varying vec2 vUv;void main(){vec4 texel=texture2D(inputBuffer,vUv);float l=luminance(texel.rgb);
#ifdef RANGE
float low=step(range.x,l);float high=step(l,range.y);l*=low*high;
#elif defined(THRESHOLD)
l=smoothstep(threshold,threshold+smoothing,l)*l;
#endif
#ifdef COLOR
gl_FragColor=vec4(texel.rgb*clamp(l,0.0,1.0),l);
#else
gl_FragColor=vec4(l);
#endif
}`;
var LuminanceMaterial = class extends ShaderMaterial {
  /**
   * Constructs a new luminance material.
   *
   * @param {Boolean} [colorOutput=false] - Defines whether the shader should output colors scaled with their luminance value.
   * @param {Vector2} [luminanceRange] - If provided, the shader will mask out texels that aren't in the specified luminance range.
   */
  constructor(colorOutput = false, luminanceRange = null) {
    super({
      name: "LuminanceMaterial",
      defines: {
        THREE_REVISION: REVISION.replace(/\D+/g, "")
      },
      uniforms: {
        inputBuffer: new Uniform(null),
        threshold: new Uniform(0),
        smoothing: new Uniform(1),
        range: new Uniform(null)
      },
      blending: NoBlending,
      toneMapped: false,
      depthWrite: false,
      depthTest: false,
      fragmentShader: luminance_default,
      vertexShader: common_default
    });
    this.colorOutput = colorOutput;
    this.luminanceRange = luminanceRange;
  }
  /**
   * The input buffer.
   *
   * @type {Texture}
   */
  set inputBuffer(value) {
    this.uniforms.inputBuffer.value = value;
  }
  /**
   * Sets the input buffer.
   *
   * @deprecated Use inputBuffer instead.
   * @param {Texture} value - The input buffer.
   */
  setInputBuffer(value) {
    this.uniforms.inputBuffer.value = value;
  }
  /**
   * The luminance threshold.
   *
   * @type {Number}
   */
  get threshold() {
    return this.uniforms.threshold.value;
  }
  set threshold(value) {
    if (this.smoothing > 0 || value > 0) {
      this.defines.THRESHOLD = "1";
    } else {
      delete this.defines.THRESHOLD;
    }
    this.uniforms.threshold.value = value;
  }
  /**
   * Returns the luminance threshold.
   *
   * @deprecated Use threshold instead.
   * @return {Number} The threshold.
   */
  getThreshold() {
    return this.threshold;
  }
  /**
   * Sets the luminance threshold.
   *
   * @deprecated Use threshold instead.
   * @param {Number} value - The threshold.
   */
  setThreshold(value) {
    this.threshold = value;
  }
  /**
   * The luminance threshold smoothing.
   *
   * @type {Number}
   */
  get smoothing() {
    return this.uniforms.smoothing.value;
  }
  set smoothing(value) {
    if (this.threshold > 0 || value > 0) {
      this.defines.THRESHOLD = "1";
    } else {
      delete this.defines.THRESHOLD;
    }
    this.uniforms.smoothing.value = value;
  }
  /**
   * Returns the luminance threshold smoothing factor.
   *
   * @deprecated Use smoothing instead.
   * @return {Number} The smoothing factor.
   */
  getSmoothingFactor() {
    return this.smoothing;
  }
  /**
   * Sets the luminance threshold smoothing factor.
   *
   * @deprecated Use smoothing instead.
   * @param {Number} value - The smoothing factor.
   */
  setSmoothingFactor(value) {
    this.smoothing = value;
  }
  /**
   * Indicates whether the luminance threshold is enabled.
   *
   * @type {Boolean}
   * @deprecated Adjust the threshold or smoothing factor instead.
   */
  get useThreshold() {
    return this.threshold > 0 || this.smoothing > 0;
  }
  set useThreshold(value) {
  }
  /**
   * Indicates whether color output is enabled.
   *
   * @type {Boolean}
   */
  get colorOutput() {
    return this.defines.COLOR !== void 0;
  }
  set colorOutput(value) {
    if (value) {
      this.defines.COLOR = "1";
    } else {
      delete this.defines.COLOR;
    }
    this.needsUpdate = true;
  }
  /**
   * Indicates whether color output is enabled.
   *
   * @deprecated Use colorOutput instead.
   * @return {Boolean} Whether color output is enabled.
   */
  isColorOutputEnabled(value) {
    return this.colorOutput;
  }
  /**
   * Enables or disables color output.
   *
   * @deprecated Use colorOutput instead.
   * @param {Boolean} value - Whether color output should be enabled.
   */
  setColorOutputEnabled(value) {
    this.colorOutput = value;
  }
  /**
   * Indicates whether luminance masking is enabled.
   *
   * @type {Boolean}
   * @deprecated
   */
  get useRange() {
    return this.luminanceRange !== null;
  }
  set useRange(value) {
    this.luminanceRange = null;
  }
  /**
   * The luminance range. Set to null to disable.
   *
   * @type {Boolean}
   */
  get luminanceRange() {
    return this.uniforms.range.value;
  }
  set luminanceRange(value) {
    if (value !== null) {
      this.defines.RANGE = "1";
    } else {
      delete this.defines.RANGE;
    }
    this.uniforms.range.value = value;
    this.needsUpdate = true;
  }
  /**
   * Returns the current luminance range.
   *
   * @deprecated Use luminanceRange instead.
   * @return {Vector2} The luminance range.
   */
  getLuminanceRange() {
    return this.luminanceRange;
  }
  /**
   * Sets a luminance range. Set to null to disable.
   *
   * @deprecated Use luminanceRange instead.
   * @param {Vector2} value - The luminance range.
   */
  setLuminanceRange(value) {
    this.luminanceRange = value;
  }
};
var LuminancePass = class extends Pass {
  /**
   * Constructs a new luminance pass.
   *
   * @param {Object} [options] - The options. See {@link LuminanceMaterial} for additional options.
   * @param {WebGLRenderTarget} [options.renderTarget] - A custom render target.
   * @param {Number} [options.resolutionScale=1.0] - The resolution scale.
   * @param {Number} [options.resolutionX=Resolution.AUTO_SIZE] - The horizontal resolution.
   * @param {Number} [options.resolutionY=Resolution.AUTO_SIZE] - The vertical resolution.
   * @param {Number} [options.width=Resolution.AUTO_SIZE] - Deprecated. Use resolutionX instead.
   * @param {Number} [options.height=Resolution.AUTO_SIZE] - Deprecated. Use resolutionY instead.
   */
  constructor({
    renderTarget,
    luminanceRange,
    colorOutput,
    resolutionScale = 1,
    width = Resolution.AUTO_SIZE,
    height = Resolution.AUTO_SIZE,
    resolutionX = width,
    resolutionY = height
  } = {}) {
    super("LuminancePass");
    this.fullscreenMaterial = new LuminanceMaterial(colorOutput, luminanceRange);
    this.needsSwap = false;
    this.renderTarget = renderTarget;
    if (this.renderTarget === void 0) {
      this.renderTarget = new WebGLRenderTarget(1, 1, { depthBuffer: false });
      this.renderTarget.texture.name = "LuminancePass.Target";
    }
    const resolution = this.resolution = new Resolution(this, resolutionX, resolutionY, resolutionScale);
    resolution.addEventListener("change", (e) => this.setSize(resolution.baseWidth, resolution.baseHeight));
  }
  /**
   * The luminance texture.
   *
   * @type {Texture}
   */
  get texture() {
    return this.renderTarget.texture;
  }
  /**
   * Returns the luminance texture.
   *
   * @deprecated Use texture instead.
   * @return {Texture} The texture.
   */
  getTexture() {
    return this.renderTarget.texture;
  }
  /**
   * Returns the resolution settings.
   *
   * @deprecated Use resolution instead.
   * @return {Resolution} The resolution.
   */
  getResolution() {
    return this.resolution;
  }
  /**
   * Renders the luminance.
   *
   * @param {WebGLRenderer} renderer - The renderer.
   * @param {WebGLRenderTarget} inputBuffer - A frame buffer that contains the result of the previous pass.
   * @param {WebGLRenderTarget} outputBuffer - A frame buffer that serves as the output render target unless this pass renders to screen.
   * @param {Number} [deltaTime] - The time between the last frame and the current one in seconds.
   * @param {Boolean} [stencilTest] - Indicates whether a stencil mask is active.
   */
  render(renderer, inputBuffer, outputBuffer, deltaTime, stencilTest) {
    const material = this.fullscreenMaterial;
    material.inputBuffer = inputBuffer.texture;
    renderer.setRenderTarget(this.renderToScreen ? null : this.renderTarget);
    renderer.render(this.scene, this.camera);
  }
  /**
   * Updates the size of this pass.
   *
   * @param {Number} width - The width.
   * @param {Number} height - The height.
   */
  setSize(width, height) {
    const resolution = this.resolution;
    resolution.setBaseSize(width, height);
    this.renderTarget.setSize(resolution.width, resolution.height);
  }
  /**
   * Performs initialization tasks.
   *
   * @param {WebGLRenderer} renderer - A renderer.
   * @param {Boolean} alpha - Whether the renderer uses the alpha channel.
   * @param {Number} frameBufferType - The type of the main frame buffers.
   */
  initialize(renderer, alpha, frameBufferType) {
    if (frameBufferType !== void 0 && frameBufferType !== UnsignedByteType) {
      this.renderTarget.texture.type = frameBufferType;
      this.fullscreenMaterial.defines.FRAMEBUFFER_PRECISION_HIGH = "1";
    }
  }
};
var convolution_downsampling_default = `#ifdef FRAMEBUFFER_PRECISION_HIGH
uniform mediump sampler2D inputBuffer;
#else
uniform lowp sampler2D inputBuffer;
#endif
#define WEIGHT_INNER 0.125
#define WEIGHT_OUTER 0.0555555
varying vec2 vUv;varying vec2 vUv00;varying vec2 vUv01;varying vec2 vUv02;varying vec2 vUv03;varying vec2 vUv04;varying vec2 vUv05;varying vec2 vUv06;varying vec2 vUv07;varying vec2 vUv08;varying vec2 vUv09;varying vec2 vUv10;varying vec2 vUv11;float clampToBorder(const in vec2 uv){return float(uv.s>=0.0&&uv.s<=1.0&&uv.t>=0.0&&uv.t<=1.0);}void main(){vec4 c=vec4(0.0);vec4 w=WEIGHT_INNER*vec4(clampToBorder(vUv00),clampToBorder(vUv01),clampToBorder(vUv02),clampToBorder(vUv03));c+=w.x*texture2D(inputBuffer,vUv00);c+=w.y*texture2D(inputBuffer,vUv01);c+=w.z*texture2D(inputBuffer,vUv02);c+=w.w*texture2D(inputBuffer,vUv03);w=WEIGHT_OUTER*vec4(clampToBorder(vUv04),clampToBorder(vUv05),clampToBorder(vUv06),clampToBorder(vUv07));c+=w.x*texture2D(inputBuffer,vUv04);c+=w.y*texture2D(inputBuffer,vUv05);c+=w.z*texture2D(inputBuffer,vUv06);c+=w.w*texture2D(inputBuffer,vUv07);w=WEIGHT_OUTER*vec4(clampToBorder(vUv08),clampToBorder(vUv09),clampToBorder(vUv10),clampToBorder(vUv11));c+=w.x*texture2D(inputBuffer,vUv08);c+=w.y*texture2D(inputBuffer,vUv09);c+=w.z*texture2D(inputBuffer,vUv10);c+=w.w*texture2D(inputBuffer,vUv11);c+=WEIGHT_OUTER*texture2D(inputBuffer,vUv);gl_FragColor=c;
#include <colorspace_fragment>
}`;
var convolution_downsampling_default2 = `uniform vec2 texelSize;varying vec2 vUv;varying vec2 vUv00;varying vec2 vUv01;varying vec2 vUv02;varying vec2 vUv03;varying vec2 vUv04;varying vec2 vUv05;varying vec2 vUv06;varying vec2 vUv07;varying vec2 vUv08;varying vec2 vUv09;varying vec2 vUv10;varying vec2 vUv11;void main(){vUv=position.xy*0.5+0.5;vUv00=vUv+texelSize*vec2(-1.0,1.0);vUv01=vUv+texelSize*vec2(1.0,1.0);vUv02=vUv+texelSize*vec2(-1.0,-1.0);vUv03=vUv+texelSize*vec2(1.0,-1.0);vUv04=vUv+texelSize*vec2(-2.0,2.0);vUv05=vUv+texelSize*vec2(0.0,2.0);vUv06=vUv+texelSize*vec2(2.0,2.0);vUv07=vUv+texelSize*vec2(-2.0,0.0);vUv08=vUv+texelSize*vec2(2.0,0.0);vUv09=vUv+texelSize*vec2(-2.0,-2.0);vUv10=vUv+texelSize*vec2(0.0,-2.0);vUv11=vUv+texelSize*vec2(2.0,-2.0);gl_Position=vec4(position.xy,1.0,1.0);}`;
var DownsamplingMaterial = class extends ShaderMaterial {
  /**
   * Constructs a new downsampling material.
   */
  constructor() {
    super({
      name: "DownsamplingMaterial",
      uniforms: {
        inputBuffer: new Uniform(null),
        texelSize: new Uniform(new Vector2())
      },
      blending: NoBlending,
      toneMapped: false,
      depthWrite: false,
      depthTest: false,
      fragmentShader: convolution_downsampling_default,
      vertexShader: convolution_downsampling_default2
    });
  }
  /**
   * The input buffer.
   *
   * @type {Texture}
   */
  set inputBuffer(value) {
    this.uniforms.inputBuffer.value = value;
  }
  /**
   * Sets the size of this object.
   *
   * @param {Number} width - The width.
   * @param {Number} height - The height.
   */
  setSize(width, height) {
    this.uniforms.texelSize.value.set(1 / width, 1 / height);
  }
};
var convolution_upsampling_default = `#ifdef FRAMEBUFFER_PRECISION_HIGH
uniform mediump sampler2D inputBuffer;uniform mediump sampler2D supportBuffer;
#else
uniform lowp sampler2D inputBuffer;uniform lowp sampler2D supportBuffer;
#endif
uniform float radius;varying vec2 vUv;varying vec2 vUv0;varying vec2 vUv1;varying vec2 vUv2;varying vec2 vUv3;varying vec2 vUv4;varying vec2 vUv5;varying vec2 vUv6;varying vec2 vUv7;void main(){vec4 c=vec4(0.0);c+=texture2D(inputBuffer,vUv0)*0.0625;c+=texture2D(inputBuffer,vUv1)*0.125;c+=texture2D(inputBuffer,vUv2)*0.0625;c+=texture2D(inputBuffer,vUv3)*0.125;c+=texture2D(inputBuffer,vUv)*0.25;c+=texture2D(inputBuffer,vUv4)*0.125;c+=texture2D(inputBuffer,vUv5)*0.0625;c+=texture2D(inputBuffer,vUv6)*0.125;c+=texture2D(inputBuffer,vUv7)*0.0625;vec4 baseColor=texture2D(supportBuffer,vUv);gl_FragColor=mix(baseColor,c,radius);
#include <colorspace_fragment>
}`;
var convolution_upsampling_default2 = `uniform vec2 texelSize;varying vec2 vUv;varying vec2 vUv0;varying vec2 vUv1;varying vec2 vUv2;varying vec2 vUv3;varying vec2 vUv4;varying vec2 vUv5;varying vec2 vUv6;varying vec2 vUv7;void main(){vUv=position.xy*0.5+0.5;vUv0=vUv+texelSize*vec2(-1.0,1.0);vUv1=vUv+texelSize*vec2(0.0,1.0);vUv2=vUv+texelSize*vec2(1.0,1.0);vUv3=vUv+texelSize*vec2(-1.0,0.0);vUv4=vUv+texelSize*vec2(1.0,0.0);vUv5=vUv+texelSize*vec2(-1.0,-1.0);vUv6=vUv+texelSize*vec2(0.0,-1.0);vUv7=vUv+texelSize*vec2(1.0,-1.0);gl_Position=vec4(position.xy,1.0,1.0);}`;
var UpsamplingMaterial = class extends ShaderMaterial {
  /**
   * Constructs a new upsampling material.
   */
  constructor() {
    super({
      name: "UpsamplingMaterial",
      uniforms: {
        inputBuffer: new Uniform(null),
        supportBuffer: new Uniform(null),
        texelSize: new Uniform(new Vector2()),
        radius: new Uniform(0.85)
      },
      blending: NoBlending,
      toneMapped: false,
      depthWrite: false,
      depthTest: false,
      fragmentShader: convolution_upsampling_default,
      vertexShader: convolution_upsampling_default2
    });
  }
  /**
   * The input buffer.
   *
   * @type {Texture}
   */
  set inputBuffer(value) {
    this.uniforms.inputBuffer.value = value;
  }
  /**
   * A support buffer.
   *
   * @type {Texture}
   */
  set supportBuffer(value) {
    this.uniforms.supportBuffer.value = value;
  }
  /**
   * The blur radius.
   *
   * @type {Number}
   */
  get radius() {
    return this.uniforms.radius.value;
  }
  set radius(value) {
    this.uniforms.radius.value = value;
  }
  /**
   * Sets the size of this object.
   *
   * @param {Number} width - The width.
   * @param {Number} height - The height.
   */
  setSize(width, height) {
    this.uniforms.texelSize.value.set(1 / width, 1 / height);
  }
};
var MipmapBlurPass = class extends Pass {
  /**
   * Constructs a new mipmap blur pass.
   *
   * @param {Object} [options] - The options.
   */
  constructor() {
    super("MipmapBlurPass");
    this.needsSwap = false;
    this.renderTarget = new WebGLRenderTarget(1, 1, { depthBuffer: false });
    this.renderTarget.texture.name = "Upsampling.Mipmap0";
    this.downsamplingMipmaps = [];
    this.upsamplingMipmaps = [];
    this.downsamplingMaterial = new DownsamplingMaterial();
    this.upsamplingMaterial = new UpsamplingMaterial();
    this.resolution = new Vector2();
  }
  /**
   * A texture that contains the blurred result.
   *
   * @type {Texture}
   */
  get texture() {
    return this.renderTarget.texture;
  }
  /**
   * The MIP levels. Default is 8.
   *
   * @type {Number}
   */
  get levels() {
    return this.downsamplingMipmaps.length;
  }
  set levels(value) {
    if (this.levels !== value) {
      const renderTarget = this.renderTarget;
      this.dispose();
      this.downsamplingMipmaps = [];
      this.upsamplingMipmaps = [];
      for (let i = 0; i < value; ++i) {
        const mipmap = renderTarget.clone();
        mipmap.texture.name = "Downsampling.Mipmap" + i;
        this.downsamplingMipmaps.push(mipmap);
      }
      this.upsamplingMipmaps.push(renderTarget);
      for (let i = 1, l = value - 1; i < l; ++i) {
        const mipmap = renderTarget.clone();
        mipmap.texture.name = "Upsampling.Mipmap" + i;
        this.upsamplingMipmaps.push(mipmap);
      }
      this.setSize(this.resolution.x, this.resolution.y);
    }
  }
  /**
   * The blur radius.
   *
   * @type {Number}
   */
  get radius() {
    return this.upsamplingMaterial.radius;
  }
  set radius(value) {
    this.upsamplingMaterial.radius = value;
  }
  /**
   * Renders the blur.
   *
   * @param {WebGLRenderer} renderer - The renderer.
   * @param {WebGLRenderTarget} inputBuffer - A frame buffer that contains the result of the previous pass.
   * @param {WebGLRenderTarget} outputBuffer - A frame buffer that serves as the output render target unless this pass renders to screen.
   * @param {Number} [deltaTime] - The time between the last frame and the current one in seconds.
   * @param {Boolean} [stencilTest] - Indicates whether a stencil mask is active.
   */
  render(renderer, inputBuffer, outputBuffer, deltaTime, stencilTest) {
    const { scene, camera } = this;
    const { downsamplingMaterial, upsamplingMaterial } = this;
    const { downsamplingMipmaps, upsamplingMipmaps } = this;
    let previousBuffer = inputBuffer;
    this.fullscreenMaterial = downsamplingMaterial;
    for (let i = 0, l = downsamplingMipmaps.length; i < l; ++i) {
      const mipmap = downsamplingMipmaps[i];
      downsamplingMaterial.setSize(previousBuffer.width, previousBuffer.height);
      downsamplingMaterial.inputBuffer = previousBuffer.texture;
      renderer.setRenderTarget(mipmap);
      renderer.render(scene, camera);
      previousBuffer = mipmap;
    }
    this.fullscreenMaterial = upsamplingMaterial;
    for (let i = upsamplingMipmaps.length - 1; i >= 0; --i) {
      const mipmap = upsamplingMipmaps[i];
      upsamplingMaterial.setSize(previousBuffer.width, previousBuffer.height);
      upsamplingMaterial.inputBuffer = previousBuffer.texture;
      upsamplingMaterial.supportBuffer = downsamplingMipmaps[i].texture;
      renderer.setRenderTarget(mipmap);
      renderer.render(scene, camera);
      previousBuffer = mipmap;
    }
  }
  /**
   * Updates the size of this pass.
   *
   * @param {Number} width - The width.
   * @param {Number} height - The height.
   */
  setSize(width, height) {
    const resolution = this.resolution;
    resolution.set(width, height);
    let w2 = resolution.width, h = resolution.height;
    for (let i = 0, l = this.downsamplingMipmaps.length; i < l; ++i) {
      w2 = Math.round(w2 * 0.5);
      h = Math.round(h * 0.5);
      this.downsamplingMipmaps[i].setSize(w2, h);
      if (i < this.upsamplingMipmaps.length) {
        this.upsamplingMipmaps[i].setSize(w2, h);
      }
    }
  }
  /**
   * Performs initialization tasks.
   *
   * @param {WebGLRenderer} renderer - The renderer.
   * @param {Boolean} alpha - Whether the renderer uses the alpha channel or not.
   * @param {Number} frameBufferType - The type of the main frame buffers.
   */
  initialize(renderer, alpha, frameBufferType) {
    if (frameBufferType !== void 0) {
      const mipmaps = this.downsamplingMipmaps.concat(this.upsamplingMipmaps);
      for (const mipmap of mipmaps) {
        mipmap.texture.type = frameBufferType;
      }
      if (frameBufferType !== UnsignedByteType) {
        this.downsamplingMaterial.defines.FRAMEBUFFER_PRECISION_HIGH = "1";
        this.upsamplingMaterial.defines.FRAMEBUFFER_PRECISION_HIGH = "1";
      } else if (renderer !== null && renderer.outputColorSpace === SRGBColorSpace) {
        for (const mipmap of mipmaps) {
          mipmap.texture.colorSpace = SRGBColorSpace;
        }
      }
    }
  }
  /**
   * Deletes internal render targets and textures.
   */
  dispose() {
    super.dispose();
    for (const mipmap of this.downsamplingMipmaps.concat(this.upsamplingMipmaps)) {
      mipmap.dispose();
    }
  }
};
var bloom_default = `#ifdef FRAMEBUFFER_PRECISION_HIGH
uniform mediump sampler2D map;
#else
uniform lowp sampler2D map;
#endif
uniform float intensity;void mainImage(const in vec4 inputColor,const in vec2 uv,out vec4 outputColor){vec4 texel=texture2D(map,uv);outputColor=vec4(texel.rgb*intensity,max(inputColor.a,texel.a));}`;
var BloomEffect = class extends Effect {
  /**
   * Constructs a new bloom effect.
   *
   * @param {Object} [options] - The options.
   * @param {BlendFunction} [options.blendFunction=BlendFunction.SCREEN] - The blend function of this effect.
   * @param {Number} [options.luminanceThreshold=1.0] - The luminance threshold. Raise this value to mask out darker elements in the scene.
   * @param {Number} [options.luminanceSmoothing=0.03] - Controls the smoothness of the luminance threshold.
   * @param {Boolean} [options.mipmapBlur=true] - Enables or disables mipmap blur.
   * @param {Number} [options.intensity=1.0] - The bloom intensity.
   * @param {Number} [options.radius=0.85] - The blur radius. Only applies to mipmap blur.
   * @param {Number} [options.levels=8] - The amount of MIP levels. Only applies to mipmap blur.
   * @param {KernelSize} [options.kernelSize=KernelSize.LARGE] - Deprecated. Use mipmapBlur instead.
   * @param {Number} [options.resolutionScale=0.5] - Deprecated. Use mipmapBlur instead.
   * @param {Number} [options.resolutionX=Resolution.AUTO_SIZE] - Deprecated. Use mipmapBlur instead.
   * @param {Number} [options.resolutionY=Resolution.AUTO_SIZE] - Deprecated. Use mipmapBlur instead.
   * @param {Number} [options.width=Resolution.AUTO_SIZE] - Deprecated. Use mipmapBlur instead.
   * @param {Number} [options.height=Resolution.AUTO_SIZE] - Deprecated. Use mipmapBlur instead.
   */
  constructor({
    blendFunction = BlendFunction.SCREEN,
    luminanceThreshold = 1,
    luminanceSmoothing = 0.03,
    mipmapBlur = true,
    intensity = 1,
    radius = 0.85,
    levels = 8,
    kernelSize = KernelSize.LARGE,
    resolutionScale = 0.5,
    width = Resolution.AUTO_SIZE,
    height = Resolution.AUTO_SIZE,
    resolutionX = width,
    resolutionY = height
  } = {}) {
    super("BloomEffect", bloom_default, {
      blendFunction,
      uniforms: /* @__PURE__ */ new Map([
        ["map", new Uniform(null)],
        ["intensity", new Uniform(intensity)]
      ])
    });
    this.renderTarget = new WebGLRenderTarget(1, 1, { depthBuffer: false });
    this.renderTarget.texture.name = "Bloom.Target";
    this.blurPass = new KawaseBlurPass({ kernelSize });
    this.luminancePass = new LuminancePass({ colorOutput: true });
    this.luminanceMaterial.threshold = luminanceThreshold;
    this.luminanceMaterial.smoothing = luminanceSmoothing;
    this.mipmapBlurPass = new MipmapBlurPass();
    this.mipmapBlurPass.enabled = mipmapBlur;
    this.mipmapBlurPass.radius = radius;
    this.mipmapBlurPass.levels = levels;
    this.uniforms.get("map").value = mipmapBlur ? this.mipmapBlurPass.texture : this.renderTarget.texture;
    const resolution = this.resolution = new Resolution(this, resolutionX, resolutionY, resolutionScale);
    resolution.addEventListener("change", (e) => this.setSize(resolution.baseWidth, resolution.baseHeight));
  }
  /**
   * A texture that contains the intermediate result of this effect.
   *
   * @type {Texture}
   */
  get texture() {
    return this.mipmapBlurPass.enabled ? this.mipmapBlurPass.texture : this.renderTarget.texture;
  }
  /**
   * Returns the generated bloom texture.
   *
   * @deprecated Use texture instead.
   * @return {Texture} The texture.
   */
  getTexture() {
    return this.texture;
  }
  /**
   * Returns the resolution settings.
   *
   * @deprecated Use resolution instead.
   * @return {Resolution} The resolution.
   */
  getResolution() {
    return this.resolution;
  }
  /**
   * Returns the blur pass.
   *
   * @deprecated
   * @return {KawaseBlurPass} The blur pass.
   */
  getBlurPass() {
    return this.blurPass;
  }
  /**
   * Returns the luminance pass.
   *
   * @deprecated Use luminancePass instead.
   * @return {LuminancePass} The luminance pass.
   */
  getLuminancePass() {
    return this.luminancePass;
  }
  /**
   * The luminance material.
   *
   * @type {LuminanceMaterial}
   */
  get luminanceMaterial() {
    return this.luminancePass.fullscreenMaterial;
  }
  /**
   * Returns the luminance material.
   *
   * @deprecated Use luminanceMaterial instead.
   * @return {LuminanceMaterial} The material.
   */
  getLuminanceMaterial() {
    return this.luminancePass.fullscreenMaterial;
  }
  /**
   * The current width of the internal render targets.
   *
   * @type {Number}
   * @deprecated
   */
  get width() {
    return this.resolution.width;
  }
  set width(value) {
    this.resolution.preferredWidth = value;
  }
  /**
   * The current height of the internal render targets.
   *
   * @type {Number}
   * @deprecated
   */
  get height() {
    return this.resolution.height;
  }
  set height(value) {
    this.resolution.preferredHeight = value;
  }
  /**
   * Indicates whether dithering is enabled.
   *
   * @type {Boolean}
   * @deprecated Use EffectPass.dithering instead.
   */
  get dithering() {
    return this.blurPass.dithering;
  }
  set dithering(value) {
    this.blurPass.dithering = value;
  }
  /**
   * The blur kernel size.
   *
   * @type {KernelSize}
   * @deprecated
   */
  get kernelSize() {
    return this.blurPass.kernelSize;
  }
  set kernelSize(value) {
    this.blurPass.kernelSize = value;
  }
  /**
   * @type {Number}
   * @deprecated
   */
  get distinction() {
    console.warn(this.name, "distinction was removed");
    return 1;
  }
  set distinction(value) {
    console.warn(this.name, "distinction was removed");
  }
  /**
   * The bloom intensity.
   *
   * @type {Number}
   */
  get intensity() {
    return this.uniforms.get("intensity").value;
  }
  set intensity(value) {
    this.uniforms.get("intensity").value = value;
  }
  /**
   * The bloom intensity.
   *
   * @deprecated Use intensity instead.
   * @return {Number} The intensity.
   */
  getIntensity() {
    return this.intensity;
  }
  /**
   * Sets the bloom intensity.
   *
   * @deprecated Use intensity instead.
   * @param {Number} value - The intensity.
   */
  setIntensity(value) {
    this.intensity = value;
  }
  /**
   * Returns the current resolution scale.
   *
   * @return {Number} The resolution scale.
   * @deprecated
   */
  getResolutionScale() {
    return this.resolution.scale;
  }
  /**
   * Sets the resolution scale.
   *
   * @param {Number} scale - The new resolution scale.
   * @deprecated
   */
  setResolutionScale(scale3) {
    this.resolution.scale = scale3;
  }
  /**
   * Updates this effect.
   *
   * @param {WebGLRenderer} renderer - The renderer.
   * @param {WebGLRenderTarget} inputBuffer - A frame buffer that contains the result of the previous pass.
   * @param {Number} [deltaTime] - The time between the last frame and the current one in seconds.
   */
  update(renderer, inputBuffer, deltaTime) {
    const renderTarget = this.renderTarget;
    const luminancePass = this.luminancePass;
    if (luminancePass.enabled) {
      luminancePass.render(renderer, inputBuffer);
      if (this.mipmapBlurPass.enabled) {
        this.mipmapBlurPass.render(renderer, luminancePass.renderTarget);
      } else {
        this.blurPass.render(renderer, luminancePass.renderTarget, renderTarget);
      }
    } else {
      if (this.mipmapBlurPass.enabled) {
        this.mipmapBlurPass.render(renderer, inputBuffer);
      } else {
        this.blurPass.render(renderer, inputBuffer, renderTarget);
      }
    }
  }
  /**
   * Updates the size of internal render targets.
   *
   * @param {Number} width - The width.
   * @param {Number} height - The height.
   */
  setSize(width, height) {
    const resolution = this.resolution;
    resolution.setBaseSize(width, height);
    this.renderTarget.setSize(resolution.width, resolution.height);
    this.blurPass.resolution.copy(resolution);
    this.luminancePass.setSize(width, height);
    this.mipmapBlurPass.setSize(width, height);
  }
  /**
   * Performs initialization tasks.
   *
   * @param {WebGLRenderer} renderer - The renderer.
   * @param {Boolean} alpha - Whether the renderer uses the alpha channel or not.
   * @param {Number} frameBufferType - The type of the main frame buffers.
   */
  initialize(renderer, alpha, frameBufferType) {
    this.blurPass.initialize(renderer, alpha, frameBufferType);
    this.luminancePass.initialize(renderer, alpha, frameBufferType);
    this.mipmapBlurPass.initialize(renderer, alpha, frameBufferType);
    if (frameBufferType !== void 0) {
      this.renderTarget.texture.type = frameBufferType;
      if (renderer !== null && renderer.outputColorSpace === SRGBColorSpace) {
        this.renderTarget.texture.colorSpace = SRGBColorSpace;
      }
    }
  }
};
var brightness_contrast_default = `uniform float brightness;uniform float contrast;void mainImage(const in vec4 inputColor,const in vec2 uv,out vec4 outputColor){vec3 color=inputColor.rgb+vec3(brightness-0.5);if(contrast>0.0){color/=vec3(1.0-contrast);}else{color*=vec3(1.0+contrast);}outputColor=vec4(color+vec3(0.5),inputColor.a);}`;
var BrightnessContrastEffect = class extends Effect {
  /**
   * Constructs a new brightness/contrast effect.
   *
   * @param {Object} [options] - The options.
   * @param {BlendFunction} [options.blendFunction=BlendFunction.SRC] - The blend function of this effect.
   * @param {Number} [options.brightness=0.0] - The brightness factor, ranging from -1 to 1, where 0 means no change.
   * @param {Number} [options.contrast=0.0] - The contrast factor, ranging from -1 to 1, where 0 means no change.
   */
  constructor({ blendFunction = BlendFunction.SRC, brightness = 0, contrast = 0 } = {}) {
    super("BrightnessContrastEffect", brightness_contrast_default, {
      blendFunction,
      uniforms: /* @__PURE__ */ new Map([
        ["brightness", new Uniform(brightness)],
        ["contrast", new Uniform(contrast)]
      ])
    });
    this.inputColorSpace = SRGBColorSpace;
  }
  /**
   * The brightness.
   *
   * @type {Number}
   */
  get brightness() {
    return this.uniforms.get("brightness").value;
  }
  set brightness(value) {
    this.uniforms.get("brightness").value = value;
  }
  /**
   * Returns the brightness.
   *
   * @deprecated Use brightness instead.
   * @return {Number} The brightness.
   */
  getBrightness() {
    return this.brightness;
  }
  /**
   * Sets the brightness.
   *
   * @deprecated Use brightness instead.
   * @param {Number} value - The brightness.
   */
  setBrightness(value) {
    this.brightness = value;
  }
  /**
   * The contrast.
   *
   * @type {Number}
   */
  get contrast() {
    return this.uniforms.get("contrast").value;
  }
  set contrast(value) {
    this.uniforms.get("contrast").value = value;
  }
  /**
   * Returns the contrast.
   *
   * @deprecated Use contrast instead.
   * @return {Number} The contrast.
   */
  getContrast() {
    return this.contrast;
  }
  /**
   * Sets the contrast.
   *
   * @deprecated Use contrast instead.
   * @param {Number} value - The contrast.
   */
  setContrast(value) {
    this.contrast = value;
  }
};
var color_average_default = `void mainImage(const in vec4 inputColor,const in vec2 uv,out vec4 outputColor){outputColor=vec4(vec3(average(inputColor.rgb)),inputColor.a);}`;
var ColorAverageEffect = class extends Effect {
  /**
   * Constructs a new color average effect.
   *
   * @param {BlendFunction} [blendFunction] - The blend function of this effect.
   */
  constructor(blendFunction) {
    super("ColorAverageEffect", color_average_default, { blendFunction });
  }
};
var color_depth_default = `uniform float factor;void mainImage(const in vec4 inputColor,const in vec2 uv,out vec4 outputColor){outputColor=vec4(floor(inputColor.rgb*factor+0.5)/factor,inputColor.a);}`;
var ColorDepthEffect = class extends Effect {
  /**
   * Constructs a new color depth effect.
   *
   * @param {Object} [options] - The options.
   * @param {BlendFunction} [options.blendFunction] - The blend function of this effect.
   * @param {Number} [options.bits=16] - The color bit depth.
   */
  constructor({ blendFunction, bits = 16 } = {}) {
    super("ColorDepthEffect", color_depth_default, {
      blendFunction,
      uniforms: /* @__PURE__ */ new Map([
        ["factor", new Uniform(1)]
      ])
    });
    this.bits = 0;
    this.bitDepth = bits;
  }
  /**
   * The virtual amount of color bits.
   *
   * Each color channel effectively uses a fourth of the total amount of bits. Alpha remains unaffected.
   *
   * @type {Number}
   */
  get bitDepth() {
    return this.bits;
  }
  set bitDepth(value) {
    this.bits = value;
    this.uniforms.get("factor").value = Math.pow(2, value / 3);
  }
  /**
   * Returns the current color bit depth.
   *
   * @return {Number} The bit depth.
   */
  getBitDepth() {
    return this.bitDepth;
  }
  /**
   * Sets the virtual amount of color bits.
   *
   * @param {Number} value - The bit depth.
   */
  setBitDepth(value) {
    this.bitDepth = value;
  }
};
var chromatic_aberration_default = `#ifdef RADIAL_MODULATION
uniform float modulationOffset;
#endif
varying float vActive;varying vec2 vUvR;varying vec2 vUvB;void mainImage(const in vec4 inputColor,const in vec2 uv,out vec4 outputColor){vec2 ra=inputColor.ra;vec2 ba=inputColor.ba;
#ifdef RADIAL_MODULATION
const vec2 center=vec2(0.5);float d=distance(uv,center)*2.0;d=max(d-modulationOffset,0.0);if(vActive>0.0&&d>0.0){ra=texture2D(inputBuffer,mix(uv,vUvR,d)).ra;ba=texture2D(inputBuffer,mix(uv,vUvB,d)).ba;}
#else
if(vActive>0.0){ra=texture2D(inputBuffer,vUvR).ra;ba=texture2D(inputBuffer,vUvB).ba;}
#endif
outputColor=vec4(ra.x,inputColor.g,ba.x,max(max(ra.y,ba.y),inputColor.a));}`;
var chromatic_aberration_default2 = `uniform vec2 offset;varying float vActive;varying vec2 vUvR;varying vec2 vUvB;void mainSupport(const in vec2 uv){vec2 shift=offset*vec2(1.0,aspect);vActive=(shift.x!=0.0||shift.y!=0.0)?1.0:0.0;vUvR=uv+shift;vUvB=uv-shift;}`;
var ChromaticAberrationEffect = class extends Effect {
  /**
   * Constructs a new chromatic aberration effect.
   *
   * @param {Object} [options] - The options.
   * @param {Vector2} [options.offset] - The color offset.
   * @param {Boolean} [options.radialModulation=false] - Whether the effect should be modulated with a radial gradient.
   * @param {Number} [options.modulationOffset=0.15] - The modulation offset. Only applies if `radialModulation` is enabled.
   */
  constructor({
    offset = new Vector2(1e-3, 5e-4),
    radialModulation = false,
    modulationOffset = 0.15
  } = {}) {
    super("ChromaticAberrationEffect", chromatic_aberration_default, {
      vertexShader: chromatic_aberration_default2,
      attributes: EffectAttribute.CONVOLUTION,
      uniforms: /* @__PURE__ */ new Map([
        ["offset", new Uniform(offset)],
        ["modulationOffset", new Uniform(modulationOffset)]
      ])
    });
    this.radialModulation = radialModulation;
  }
  /**
   * The color offset.
   *
   * @type {Vector2}
   */
  get offset() {
    return this.uniforms.get("offset").value;
  }
  set offset(value) {
    this.uniforms.get("offset").value = value;
  }
  /**
   * Indicates whether radial modulation is enabled.
   *
   * When enabled, the effect will be weaker in the middle and stronger towards the screen edges.
   *
   * @type {Boolean}
   */
  get radialModulation() {
    return this.defines.has("RADIAL_MODULATION");
  }
  set radialModulation(value) {
    if (value) {
      this.defines.set("RADIAL_MODULATION", "1");
    } else {
      this.defines.delete("RADIAL_MODULATION");
    }
    this.setChanged();
  }
  /**
   * The modulation offset.
   *
   * @type {Number}
   */
  get modulationOffset() {
    return this.uniforms.get("modulationOffset").value;
  }
  set modulationOffset(value) {
    this.uniforms.get("modulationOffset").value = value;
  }
  /**
   * Returns the color offset vector.
   *
   * @deprecated Use offset instead.
   * @return {Vector2} The offset.
   */
  getOffset() {
    return this.offset;
  }
  /**
   * Sets the color offset vector.
   *
   * @deprecated Use offset instead.
   * @param {Vector2} value - The offset.
   */
  setOffset(value) {
    this.offset = value;
  }
};
var depth_default = `void mainImage(const in vec4 inputColor,const in vec2 uv,const in float depth,out vec4 outputColor){
#ifdef INVERTED
vec3 color=vec3(1.0-depth);
#else
vec3 color=vec3(depth);
#endif
outputColor=vec4(color,inputColor.a);}`;
var DepthEffect = class extends Effect {
  /**
   * Constructs a new depth effect.
   *
   * @param {Object} [options] - The options.
   * @param {BlendFunction} [options.blendFunction=BlendFunction.SRC] - The blend function of this effect.
   * @param {Boolean} [options.inverted=false] - Whether the depth should be inverted.
   */
  constructor({ blendFunction = BlendFunction.SRC, inverted = false } = {}) {
    super("DepthEffect", depth_default, {
      blendFunction,
      attributes: EffectAttribute.DEPTH
    });
    this.inverted = inverted;
  }
  /**
   * Indicates whether depth should be inverted.
   *
   * @type {Boolean}
   */
  get inverted() {
    return this.defines.has("INVERTED");
  }
  set inverted(value) {
    if (this.inverted !== value) {
      if (value) {
        this.defines.set("INVERTED", "1");
      } else {
        this.defines.delete("INVERTED");
      }
      this.setChanged();
    }
  }
  /**
   * Indicates whether the rendered depth is inverted.
   *
   * @deprecated Use inverted instead.
   * @return {Boolean} Whether the rendered depth is inverted.
   */
  isInverted() {
    return this.inverted;
  }
  /**
   * Enables or disables depth inversion.
   *
   * @deprecated Use inverted instead.
   * @param {Boolean} value - Whether depth should be inverted.
   */
  setInverted(value) {
    this.inverted = value;
  }
};
var ColorChannel = {
  RED: 0,
  GREEN: 1,
  BLUE: 2,
  ALPHA: 3
};
var MaskFunction = {
  DISCARD: 0,
  MULTIPLY: 1,
  MULTIPLY_RGB_SET_ALPHA: 2,
  MULTIPLY_RGB: 3
};
var convolution_bokeh_default = `#ifdef FRAMEBUFFER_PRECISION_HIGH
uniform mediump sampler2D inputBuffer;
#else
uniform lowp sampler2D inputBuffer;
#endif
#if PASS == 1
uniform vec4 kernel64[32];
#else
uniform vec4 kernel16[8];
#endif
uniform lowp sampler2D cocBuffer;uniform vec2 texelSize;uniform float scale;varying vec2 vUv;void main(){
#ifdef FOREGROUND
vec2 cocNearFar=texture2D(cocBuffer,vUv).rg*scale;float coc=cocNearFar.x;
#else
float coc=texture2D(cocBuffer,vUv).g*scale;
#endif
if(coc==0.0){gl_FragColor=texture2D(inputBuffer,vUv);}else{
#ifdef FOREGROUND
vec2 step=texelSize*max(cocNearFar.x,cocNearFar.y);
#else
vec2 step=texelSize*coc;
#endif
#if PASS == 1
vec4 acc=vec4(0.0);for(int i=0;i<32;++i){vec4 kernel=kernel64[i];vec2 uv=step*kernel.xy+vUv;acc+=texture2D(inputBuffer,uv);uv=step*kernel.zw+vUv;acc+=texture2D(inputBuffer,uv);}gl_FragColor=acc/64.0;
#else
vec4 maxValue=texture2D(inputBuffer,vUv);for(int i=0;i<8;++i){vec4 kernel=kernel16[i];vec2 uv=step*kernel.xy+vUv;maxValue=max(texture2D(inputBuffer,uv),maxValue);uv=step*kernel.zw+vUv;maxValue=max(texture2D(inputBuffer,uv),maxValue);}gl_FragColor=maxValue;
#endif
}}`;
var BokehMaterial = class extends ShaderMaterial {
  /**
   * Constructs a new bokeh material.
   *
   * @param {Boolean} [fill=false] - Enables or disables the bokeh highlight fill mode.
   * @param {Boolean} [foreground=false] - Determines whether this material will be applied to foreground colors.
   */
  constructor(fill = false, foreground = false) {
    super({
      name: "BokehMaterial",
      defines: {
        PASS: fill ? "2" : "1"
      },
      uniforms: {
        inputBuffer: new Uniform(null),
        cocBuffer: new Uniform(null),
        texelSize: new Uniform(new Vector2()),
        kernel64: new Uniform(null),
        kernel16: new Uniform(null),
        scale: new Uniform(1)
      },
      blending: NoBlending,
      toneMapped: false,
      depthWrite: false,
      depthTest: false,
      fragmentShader: convolution_bokeh_default,
      vertexShader: common_default
    });
    if (foreground) {
      this.defines.FOREGROUND = "1";
    }
    this.generateKernel();
  }
  /**
   * The input buffer.
   *
   * @type {Texture}
   */
  set inputBuffer(value) {
    this.uniforms.inputBuffer.value = value;
  }
  /**
   * Sets the input buffer.
   *
   * @deprecated Use inputBuffer instead.
   * @param {Texture} value - The buffer.
   */
  setInputBuffer(value) {
    this.uniforms.inputBuffer.value = value;
  }
  /**
   * The circle of confusion buffer.
   *
   * @type {Texture}
   */
  set cocBuffer(value) {
    this.uniforms.cocBuffer.value = value;
  }
  /**
   * Sets the circle of confusion buffer.
   *
   * @deprecated Use cocBuffer instead.
   * @param {Texture} value - The buffer.
   */
  setCoCBuffer(value) {
    this.uniforms.cocBuffer.value = value;
  }
  /**
   * The blur scale.
   *
   * @type {Number}
   */
  get scale() {
    return this.uniforms.scale.value;
  }
  set scale(value) {
    this.uniforms.scale.value = value;
  }
  /**
   * Returns the blur scale.
   *
   * @deprecated Use scale instead.
   * @return {Number} The scale.
   */
  getScale(value) {
    return this.scale;
  }
  /**
   * Sets the blur scale.
   *
   * @deprecated Use scale instead.
   * @param {Number} value - The scale.
   */
  setScale(value) {
    this.scale = value;
  }
  /**
   * Generates the blur kernel.
   *
   * @private
   */
  generateKernel() {
    const GOLDEN_ANGLE = 2.39996323;
    const points64 = new Float64Array(128);
    const points16 = new Float64Array(32);
    let i64 = 0, i16 = 0;
    for (let i = 0, sqrt80 = Math.sqrt(80); i < 80; ++i) {
      const theta = i * GOLDEN_ANGLE;
      const r = Math.sqrt(i) / sqrt80;
      const u = r * Math.cos(theta), v3 = r * Math.sin(theta);
      if (i % 5 === 0) {
        points16[i16++] = u;
        points16[i16++] = v3;
      } else {
        points64[i64++] = u;
        points64[i64++] = v3;
      }
    }
    this.uniforms.kernel64.value = points64;
    this.uniforms.kernel16.value = points16;
  }
  /**
   * Sets the texel size.
   *
   * @deprecated Use setSize() instead.
   * @param {Number} x - The texel width.
   * @param {Number} y - The texel height.
   */
  setTexelSize(x, y) {
    this.uniforms.texelSize.value.set(x, y);
  }
  /**
   * Sets the size of this object.
   *
   * @param {Number} width - The width.
   * @param {Number} height - The height.
   */
  setSize(width, height) {
    this.uniforms.texelSize.value.set(1 / width, 1 / height);
  }
};
function orthographicDepthToViewZ(depth, near, far) {
  return depth * (near - far) - near;
}
function viewZToOrthographicDepth(viewZ, near, far) {
  return Math.min(Math.max((viewZ + near) / (near - far), 0), 1);
}
var circle_of_confusion_default = `#include <common>
#include <packing>
#ifdef GL_FRAGMENT_PRECISION_HIGH
uniform highp sampler2D depthBuffer;
#else
uniform mediump sampler2D depthBuffer;
#endif
uniform float focusDistance;uniform float focusRange;uniform float cameraNear;uniform float cameraFar;varying vec2 vUv;float readDepth(const in vec2 uv){
#if DEPTH_PACKING == 3201
float depth=unpackRGBAToDepth(texture2D(depthBuffer,uv));
#else
float depth=texture2D(depthBuffer,uv).r;
#endif
#ifdef LOG_DEPTH
float d=pow(2.0,depth*log2(cameraFar+1.0))-1.0;float a=cameraFar/(cameraFar-cameraNear);float b=cameraFar*cameraNear/(cameraNear-cameraFar);depth=a+b/d;
#endif
return depth;}void main(){float depth=readDepth(vUv);
#ifdef PERSPECTIVE_CAMERA
float viewZ=perspectiveDepthToViewZ(depth,cameraNear,cameraFar);float linearDepth=viewZToOrthographicDepth(viewZ,cameraNear,cameraFar);
#else
float linearDepth=depth;
#endif
float signedDistance=linearDepth-focusDistance;float magnitude=smoothstep(0.0,focusRange,abs(signedDistance));gl_FragColor.rg=magnitude*vec2(step(signedDistance,0.0),step(0.0,signedDistance));}`;
var CircleOfConfusionMaterial = class extends ShaderMaterial {
  /**
   * Constructs a new CoC material.
   *
   * @param {Camera} camera - A camera.
   */
  constructor(camera) {
    super({
      name: "CircleOfConfusionMaterial",
      defines: {
        DEPTH_PACKING: "0"
      },
      uniforms: {
        depthBuffer: new Uniform(null),
        focusDistance: new Uniform(0),
        focusRange: new Uniform(0),
        cameraNear: new Uniform(0.3),
        cameraFar: new Uniform(1e3)
      },
      blending: NoBlending,
      toneMapped: false,
      depthWrite: false,
      depthTest: false,
      fragmentShader: circle_of_confusion_default,
      vertexShader: common_default
    });
    this.uniforms.focalLength = this.uniforms.focusRange;
    this.copyCameraSettings(camera);
  }
  /**
   * The current near plane setting.
   *
   * @type {Number}
   * @private
   */
  get near() {
    return this.uniforms.cameraNear.value;
  }
  /**
   * The current far plane setting.
   *
   * @type {Number}
   * @private
   */
  get far() {
    return this.uniforms.cameraFar.value;
  }
  /**
   * The depth buffer.
   *
   * @type {Texture}
   */
  set depthBuffer(value) {
    this.uniforms.depthBuffer.value = value;
  }
  /**
   * The depth packing strategy.
   *
   * @type {DepthPackingStrategies}
   */
  set depthPacking(value) {
    this.defines.DEPTH_PACKING = value.toFixed(0);
    this.needsUpdate = true;
  }
  /**
   * Sets the depth buffer.
   *
   * @deprecated Use depthBuffer and depthPacking instead.
   * @param {Texture} buffer - The depth texture.
   * @param {DepthPackingStrategies} [depthPacking=BasicDepthPacking] - The depth packing strategy.
   */
  setDepthBuffer(buffer2, depthPacking = BasicDepthPacking) {
    this.depthBuffer = buffer2;
    this.depthPacking = depthPacking;
  }
  /**
   * The focus distance. Range: [0.0, 1.0].
   *
   * @type {Number}
   */
  get focusDistance() {
    return this.uniforms.focusDistance.value;
  }
  set focusDistance(value) {
    this.uniforms.focusDistance.value = value;
  }
  /**
   * The focus distance in world units.
   *
   * @type {Number}
   */
  get worldFocusDistance() {
    return -orthographicDepthToViewZ(this.focusDistance, this.near, this.far);
  }
  set worldFocusDistance(value) {
    this.focusDistance = viewZToOrthographicDepth(-value, this.near, this.far);
  }
  /**
   * Returns the focus distance.
   *
   * @deprecated Use focusDistance instead.
   * @return {Number} The focus distance.
   */
  getFocusDistance(value) {
    this.uniforms.focusDistance.value = value;
  }
  /**
   * Sets the focus distance.
   *
   * @deprecated Use focusDistance instead.
   * @param {Number} value - The focus distance.
   */
  setFocusDistance(value) {
    this.uniforms.focusDistance.value = value;
  }
  /**
   * The focal length.
   *
   * @deprecated Renamed to focusRange.
   * @type {Number}
   */
  get focalLength() {
    return this.focusRange;
  }
  set focalLength(value) {
    this.focusRange = value;
  }
  /**
   * The focus range. Range: [0.0, 1.0].
   *
   * @type {Number}
   */
  get focusRange() {
    return this.uniforms.focusRange.value;
  }
  set focusRange(value) {
    this.uniforms.focusRange.value = value;
  }
  /**
   * The focus range in world units.
   *
   * @type {Number}
   */
  get worldFocusRange() {
    return -orthographicDepthToViewZ(this.focusRange, this.near, this.far);
  }
  set worldFocusRange(value) {
    this.focusRange = viewZToOrthographicDepth(-value, this.near, this.far);
  }
  /**
   * Returns the focal length.
   *
   * @deprecated Use focusRange instead.
   * @return {Number} The focal length.
   */
  getFocalLength(value) {
    return this.focusRange;
  }
  /**
   * Sets the focal length.
   *
   * @deprecated Use focusRange instead.
   * @param {Number} value - The focal length.
   */
  setFocalLength(value) {
    this.focusRange = value;
  }
  /**
   * Copies the settings of the given camera.
   *
   * @deprecated Use copyCameraSettings instead.
   * @param {Camera} camera - A camera.
   */
  adoptCameraSettings(camera) {
    this.copyCameraSettings(camera);
  }
  /**
   * Copies the settings of the given camera.
   *
   * @param {Camera} camera - A camera.
   */
  copyCameraSettings(camera) {
    if (camera) {
      this.uniforms.cameraNear.value = camera.near;
      this.uniforms.cameraFar.value = camera.far;
      if (camera instanceof PerspectiveCamera) {
        this.defines.PERSPECTIVE_CAMERA = "1";
      } else {
        delete this.defines.PERSPECTIVE_CAMERA;
      }
      this.needsUpdate = true;
    }
  }
};
var mask_default = `#ifdef FRAMEBUFFER_PRECISION_HIGH
uniform mediump sampler2D inputBuffer;
#else
uniform lowp sampler2D inputBuffer;
#endif
#ifdef MASK_PRECISION_HIGH
uniform mediump sampler2D maskTexture;
#else
uniform lowp sampler2D maskTexture;
#endif
#if MASK_FUNCTION != 0
uniform float strength;
#endif
varying vec2 vUv;void main(){
#if COLOR_CHANNEL == 0
float mask=texture2D(maskTexture,vUv).r;
#elif COLOR_CHANNEL == 1
float mask=texture2D(maskTexture,vUv).g;
#elif COLOR_CHANNEL == 2
float mask=texture2D(maskTexture,vUv).b;
#else
float mask=texture2D(maskTexture,vUv).a;
#endif
#if MASK_FUNCTION == 0
#ifdef INVERTED
mask=step(mask,0.0);
#else
mask=1.0-step(mask,0.0);
#endif
#else
mask=clamp(mask*strength,0.0,1.0);
#ifdef INVERTED
mask=1.0-mask;
#endif
#endif
#if MASK_FUNCTION == 3
vec4 texel=texture2D(inputBuffer,vUv);gl_FragColor=vec4(mask*texel.rgb,texel.a);
#elif MASK_FUNCTION == 2
gl_FragColor=vec4(mask*texture2D(inputBuffer,vUv).rgb,mask);
#else
gl_FragColor=mask*texture2D(inputBuffer,vUv);
#endif
}`;
var MaskMaterial = class extends ShaderMaterial {
  /**
   * Constructs a new mask material.
   *
   * @param {Texture} [maskTexture] - The mask texture.
   */
  constructor(maskTexture = null) {
    super({
      name: "MaskMaterial",
      uniforms: {
        maskTexture: new Uniform(maskTexture),
        inputBuffer: new Uniform(null),
        strength: new Uniform(1)
      },
      blending: NoBlending,
      toneMapped: false,
      depthWrite: false,
      depthTest: false,
      fragmentShader: mask_default,
      vertexShader: common_default
    });
    this.colorChannel = ColorChannel.RED;
    this.maskFunction = MaskFunction.DISCARD;
  }
  /**
   * The input buffer.
   *
   * @type {Texture}
   */
  set inputBuffer(value) {
    this.uniforms.inputBuffer.value = value;
  }
  /**
   * Sets the input buffer.
   *
   * @deprecated Use inputBuffer instead.
   * @param {Texture} value - The input buffer.
   */
  setInputBuffer(value) {
    this.uniforms.inputBuffer.value = value;
  }
  /**
   * The mask texture.
   *
   * @type {Texture}
   */
  set maskTexture(value) {
    this.uniforms.maskTexture.value = value;
    delete this.defines.MASK_PRECISION_HIGH;
    if (value.type !== UnsignedByteType) {
      this.defines.MASK_PRECISION_HIGH = "1";
    }
    this.needsUpdate = true;
  }
  /**
   * Sets the mask texture.
   *
   * @deprecated Use maskTexture instead.
   * @param {Texture} value - The texture.
   */
  setMaskTexture(value) {
    this.maskTexture = value;
  }
  /**
   * Sets the color channel to use for masking. Default is `ColorChannel.RED`.
   *
   * @type {ColorChannel}
   */
  set colorChannel(value) {
    this.defines.COLOR_CHANNEL = value.toFixed(0);
    this.needsUpdate = true;
  }
  /**
   * Sets the color channel to use for masking. Default is `ColorChannel.RED`.
   *
   * @deprecated Use colorChannel instead.
   * @param {ColorChannel} value - The channel.
   */
  setColorChannel(value) {
    this.colorChannel = value;
  }
  /**
   * The masking technique. Default is `MaskFunction.DISCARD`.
   *
   * @type {MaskFunction}
   */
  set maskFunction(value) {
    this.defines.MASK_FUNCTION = value.toFixed(0);
    this.needsUpdate = true;
  }
  /**
   * Sets the masking technique. Default is `MaskFunction.DISCARD`.
   *
   * @deprecated Use maskFunction instead.
   * @param {MaskFunction} value - The function.
   */
  setMaskFunction(value) {
    this.maskFunction = value;
  }
  /**
   * Indicates whether the masking is inverted.
   *
   * @type {Boolean}
   */
  get inverted() {
    return this.defines.INVERTED !== void 0;
  }
  set inverted(value) {
    if (this.inverted && !value) {
      delete this.defines.INVERTED;
    } else if (value) {
      this.defines.INVERTED = "1";
    }
    this.needsUpdate = true;
  }
  /**
   * Indicates whether the masking is inverted.
   *
   * @deprecated Use inverted instead.
   * @return {Boolean} Whether the masking is inverted.
   */
  isInverted() {
    return this.inverted;
  }
  /**
   * Determines whether the masking should be inverted.
   *
   * @deprecated Use inverted instead.
   * @param {Boolean} value - Whether the masking should be inverted.
   */
  setInverted(value) {
    this.inverted = value;
  }
  /**
   * The current mask strength.
   *
   * Individual mask values will be clamped to [0.0, 1.0]. Has no effect when the mask function is set to `DISCARD`.
   *
   * @type {Number}
   */
  get strength() {
    return this.uniforms.strength.value;
  }
  set strength(value) {
    this.uniforms.strength.value = value;
  }
  /**
   * Returns the current mask strength.
   *
   * @deprecated Use strength instead.
   * @return {Number} The mask strength.
   */
  getStrength() {
    return this.strength;
  }
  /**
   * Sets the mask strength.
   *
   * Has no effect when the mask function is set to `DISCARD`.
   *
   * @deprecated Use strength instead.
   * @param {Number} value - The mask strength.
   */
  setStrength(value) {
    this.strength = value;
  }
};
var ShaderPass = class extends Pass {
  /**
   * Constructs a new shader pass.
   *
   * @param {ShaderMaterial} material - A shader material.
   * @param {String} [input="inputBuffer"] - The name of the input buffer uniform.
   */
  constructor(material, input = "inputBuffer") {
    super("ShaderPass");
    this.fullscreenMaterial = material;
    this.input = input;
  }
  /**
   * Sets the name of the input buffer uniform.
   *
   * @param {String} input - The name of the input buffer uniform.
   * @deprecated Use input instead.
   */
  setInput(input) {
    this.input = input;
  }
  /**
   * Renders the effect.
   *
   * @param {WebGLRenderer} renderer - The renderer.
   * @param {WebGLRenderTarget} inputBuffer - A frame buffer that contains the result of the previous pass.
   * @param {WebGLRenderTarget} outputBuffer - A frame buffer that serves as the output render target unless this pass renders to screen.
   * @param {Number} [deltaTime] - The time between the last frame and the current one in seconds.
   * @param {Boolean} [stencilTest] - Indicates whether a stencil mask is active.
   */
  render(renderer, inputBuffer, outputBuffer, deltaTime, stencilTest) {
    const uniforms = this.fullscreenMaterial.uniforms;
    if (inputBuffer !== null && uniforms !== void 0 && uniforms[this.input] !== void 0) {
      uniforms[this.input].value = inputBuffer.texture;
    }
    renderer.setRenderTarget(this.renderToScreen ? null : outputBuffer);
    renderer.render(this.scene, this.camera);
  }
  /**
   * Performs initialization tasks.
   *
   * @param {WebGLRenderer} renderer - A renderer.
   * @param {Boolean} alpha - Whether the renderer uses the alpha channel.
   * @param {Number} frameBufferType - The type of the main frame buffers.
   */
  initialize(renderer, alpha, frameBufferType) {
    if (frameBufferType !== void 0 && frameBufferType !== UnsignedByteType) {
      this.fullscreenMaterial.defines.FRAMEBUFFER_PRECISION_HIGH = "1";
    }
  }
};
var depth_of_field_default = `#ifdef FRAMEBUFFER_PRECISION_HIGH
uniform mediump sampler2D nearColorBuffer;uniform mediump sampler2D farColorBuffer;
#else
uniform lowp sampler2D nearColorBuffer;uniform lowp sampler2D farColorBuffer;
#endif
uniform lowp sampler2D nearCoCBuffer;uniform lowp sampler2D farCoCBuffer;uniform float scale;void mainImage(const in vec4 inputColor,const in vec2 uv,const in float depth,out vec4 outputColor){vec4 colorNear=texture2D(nearColorBuffer,uv);vec4 colorFar=texture2D(farColorBuffer,uv);
#if MASK_FUNCTION == 1
vec2 cocNearFar=vec2(texture2D(nearCoCBuffer,uv).r,colorFar.a);cocNearFar.x=min(cocNearFar.x*scale,1.0);
#else
vec2 cocNearFar=vec2(texture2D(nearCoCBuffer,uv).r,texture2D(farCoCBuffer,uv).g);cocNearFar=min(cocNearFar*scale,1.0);
#endif
vec4 result=inputColor*(1.0-cocNearFar.y)+colorFar;result=mix(result,colorNear,cocNearFar.x);outputColor=result;}`;
var DepthOfFieldEffect = class extends Effect {
  /**
   * Constructs a new depth of field effect.
   *
   * @param {Camera} camera - The main camera.
   * @param {Object} [options] - The options.
   * @param {BlendFunction} [options.blendFunction] - The blend function of this effect.
   * @param {Number} [options.worldFocusDistance] - The focus distance in world units.
   * @param {Number} [options.worldFocusRange] - The focus distance in world units.
   * @param {Number} [options.focusDistance=0.0] - The normalized focus distance. Range is [0.0, 1.0].
   * @param {Number} [options.focusRange=0.1] - The focus range. Range is [0.0, 1.0].
   * @param {Number} [options.focalLength=0.1] - Deprecated.
   * @param {Number} [options.bokehScale=1.0] - The scale of the bokeh blur.
   * @param {Number} [options.resolutionScale=0.5] - The resolution scale.
   * @param {Number} [options.resolutionX=Resolution.AUTO_SIZE] - The horizontal resolution.
   * @param {Number} [options.resolutionY=Resolution.AUTO_SIZE] - The vertical resolution.
   * @param {Number} [options.width=Resolution.AUTO_SIZE] - Deprecated. Use resolutionX instead.
   * @param {Number} [options.height=Resolution.AUTO_SIZE] - Deprecated. Use resolutionY instead.
   */
  constructor(camera, {
    blendFunction,
    worldFocusDistance,
    worldFocusRange,
    focusDistance = 0,
    focalLength = 0.1,
    focusRange = focalLength,
    bokehScale = 1,
    resolutionScale = 1,
    width = Resolution.AUTO_SIZE,
    height = Resolution.AUTO_SIZE,
    resolutionX = width,
    resolutionY = height
  } = {}) {
    super("DepthOfFieldEffect", depth_of_field_default, {
      blendFunction,
      attributes: EffectAttribute.DEPTH,
      uniforms: /* @__PURE__ */ new Map([
        ["nearColorBuffer", new Uniform(null)],
        ["farColorBuffer", new Uniform(null)],
        ["nearCoCBuffer", new Uniform(null)],
        ["farCoCBuffer", new Uniform(null)],
        ["scale", new Uniform(1)]
      ])
    });
    this.camera = camera;
    this.renderTarget = new WebGLRenderTarget(1, 1, { depthBuffer: false });
    this.renderTarget.texture.name = "DoF.Intermediate";
    this.renderTargetMasked = this.renderTarget.clone();
    this.renderTargetMasked.texture.name = "DoF.Masked.Far";
    this.renderTargetNear = this.renderTarget.clone();
    this.renderTargetNear.texture.name = "DoF.Bokeh.Near";
    this.uniforms.get("nearColorBuffer").value = this.renderTargetNear.texture;
    this.renderTargetFar = this.renderTarget.clone();
    this.renderTargetFar.texture.name = "DoF.Bokeh.Far";
    this.uniforms.get("farColorBuffer").value = this.renderTargetFar.texture;
    this.renderTargetCoC = this.renderTarget.clone();
    this.renderTargetCoC.texture.name = "DoF.CoC";
    this.uniforms.get("farCoCBuffer").value = this.renderTargetCoC.texture;
    this.renderTargetCoCBlurred = this.renderTargetCoC.clone();
    this.renderTargetCoCBlurred.texture.name = "DoF.CoC.Blurred";
    this.uniforms.get("nearCoCBuffer").value = this.renderTargetCoCBlurred.texture;
    this.cocPass = new ShaderPass(new CircleOfConfusionMaterial(camera));
    const cocMaterial = this.cocMaterial;
    cocMaterial.focusDistance = focusDistance;
    cocMaterial.focusRange = focusRange;
    if (worldFocusDistance !== void 0) {
      cocMaterial.worldFocusDistance = worldFocusDistance;
    }
    if (worldFocusRange !== void 0) {
      cocMaterial.worldFocusRange = worldFocusRange;
    }
    this.blurPass = new KawaseBlurPass({ resolutionScale, resolutionX, resolutionY, kernelSize: KernelSize.MEDIUM });
    this.maskPass = new ShaderPass(new MaskMaterial(this.renderTargetCoC.texture));
    const maskMaterial = this.maskPass.fullscreenMaterial;
    maskMaterial.colorChannel = ColorChannel.GREEN;
    this.maskFunction = MaskFunction.MULTIPLY_RGB;
    this.bokehNearBasePass = new ShaderPass(new BokehMaterial(false, true));
    this.bokehNearBasePass.fullscreenMaterial.cocBuffer = this.renderTargetCoCBlurred.texture;
    this.bokehNearFillPass = new ShaderPass(new BokehMaterial(true, true));
    this.bokehNearFillPass.fullscreenMaterial.cocBuffer = this.renderTargetCoCBlurred.texture;
    this.bokehFarBasePass = new ShaderPass(new BokehMaterial(false, false));
    this.bokehFarBasePass.fullscreenMaterial.cocBuffer = this.renderTargetCoC.texture;
    this.bokehFarFillPass = new ShaderPass(new BokehMaterial(true, false));
    this.bokehFarFillPass.fullscreenMaterial.cocBuffer = this.renderTargetCoC.texture;
    this.target = null;
    const resolution = this.resolution = new Resolution(this, resolutionX, resolutionY, resolutionScale);
    resolution.addEventListener("change", (e) => this.setSize(resolution.baseWidth, resolution.baseHeight));
    this.bokehScale = bokehScale;
  }
  set mainCamera(value) {
    this.camera = value;
    this.cocMaterial.copyCameraSettings(value);
  }
  /**
   * The circle of confusion texture.
   *
   * @type {Texture}
   */
  get cocTexture() {
    return this.renderTargetCoC.texture;
  }
  /**
   * The mask function. Default is `MULTIPLY_RGB`.
   *
   * @type {MaskFunction}
   */
  get maskFunction() {
    return this.maskPass.fullscreenMaterial.maskFunction;
  }
  set maskFunction(value) {
    if (this.maskFunction !== value) {
      this.defines.set("MASK_FUNCTION", value.toFixed(0));
      this.maskPass.fullscreenMaterial.maskFunction = value;
      this.setChanged();
    }
  }
  /**
   * The circle of confusion material.
   *
   * @type {CircleOfConfusionMaterial}
   */
  get cocMaterial() {
    return this.cocPass.fullscreenMaterial;
  }
  /**
   * The circle of confusion material.
   *
   * @deprecated Use cocMaterial instead.
   * @type {CircleOfConfusionMaterial}
   */
  get circleOfConfusionMaterial() {
    return this.cocMaterial;
  }
  /**
   * Returns the circle of confusion material.
   *
   * @deprecated Use cocMaterial instead.
   * @return {CircleOfConfusionMaterial} The material.
   */
  getCircleOfConfusionMaterial() {
    return this.cocMaterial;
  }
  /**
   * Returns the pass that blurs the foreground CoC buffer to soften edges.
   *
   * @deprecated Use blurPass instead.
   * @return {KawaseBlurPass} The blur pass.
   */
  getBlurPass() {
    return this.blurPass;
  }
  /**
   * Returns the resolution settings.
   *
   * @deprecated Use resolution instead.
   * @return {Resolution} The resolution.
   */
  getResolution() {
    return this.resolution;
  }
  /**
   * The current bokeh scale.
   *
   * @type {Number}
   */
  get bokehScale() {
    return this.uniforms.get("scale").value;
  }
  set bokehScale(value) {
    this.bokehNearBasePass.fullscreenMaterial.scale = value;
    this.bokehNearFillPass.fullscreenMaterial.scale = value;
    this.bokehFarBasePass.fullscreenMaterial.scale = value;
    this.bokehFarFillPass.fullscreenMaterial.scale = value;
    this.maskPass.fullscreenMaterial.strength = value;
    this.uniforms.get("scale").value = value;
  }
  /**
   * Returns the current bokeh scale.
   *
   * @deprecated Use bokehScale instead.
   * @return {Number} The scale.
   */
  getBokehScale() {
    return this.bokehScale;
  }
  /**
   * Sets the bokeh scale.
   *
   * @deprecated Use bokehScale instead.
   * @param {Number} value - The scale.
   */
  setBokehScale(value) {
    this.bokehScale = value;
  }
  /**
   * Returns the current auto focus target.
   *
   * @deprecated Use target instead.
   * @return {Vector3} The target.
   */
  getTarget() {
    return this.target;
  }
  /**
   * Sets the auto focus target.
   *
   * @deprecated Use target instead.
   * @param {Vector3} value - The target.
   */
  setTarget(value) {
    this.target = value;
  }
  /**
   * Calculates the focus distance from the camera to the given position.
   *
   * @param {Vector3} target - The target.
   * @return {Number} The normalized focus distance.
   */
  calculateFocusDistance(target) {
    const camera = this.camera;
    const distance3 = camera.position.distanceTo(target);
    return viewZToOrthographicDepth(-distance3, camera.near, camera.far);
  }
  /**
   * Sets the depth texture.
   *
   * @param {Texture} depthTexture - A depth texture.
   * @param {DepthPackingStrategies} [depthPacking=BasicDepthPacking] - The depth packing.
   */
  setDepthTexture(depthTexture, depthPacking = BasicDepthPacking) {
    this.cocMaterial.depthBuffer = depthTexture;
    this.cocMaterial.depthPacking = depthPacking;
  }
  /**
   * Updates this effect.
   *
   * @param {WebGLRenderer} renderer - The renderer.
   * @param {WebGLRenderTarget} inputBuffer - A frame buffer that contains the result of the previous pass.
   * @param {Number} [deltaTime] - The time between the last frame and the current one in seconds.
   */
  update(renderer, inputBuffer, deltaTime) {
    const renderTarget = this.renderTarget;
    const renderTargetCoC = this.renderTargetCoC;
    const renderTargetCoCBlurred = this.renderTargetCoCBlurred;
    const renderTargetMasked = this.renderTargetMasked;
    if (this.target !== null) {
      const distance3 = this.calculateFocusDistance(this.target);
      this.cocMaterial.focusDistance = distance3;
    }
    this.cocPass.render(renderer, null, renderTargetCoC);
    this.blurPass.render(renderer, renderTargetCoC, renderTargetCoCBlurred);
    this.maskPass.render(renderer, inputBuffer, renderTargetMasked);
    this.bokehFarBasePass.render(renderer, renderTargetMasked, renderTarget);
    this.bokehFarFillPass.render(renderer, renderTarget, this.renderTargetFar);
    this.bokehNearBasePass.render(renderer, inputBuffer, renderTarget);
    this.bokehNearFillPass.render(renderer, renderTarget, this.renderTargetNear);
  }
  /**
   * Updates the size of internal render targets.
   *
   * @param {Number} width - The width.
   * @param {Number} height - The height.
   */
  setSize(width, height) {
    const resolution = this.resolution;
    resolution.setBaseSize(width, height);
    const w2 = resolution.width, h = resolution.height;
    this.cocPass.setSize(width, height);
    this.blurPass.setSize(width, height);
    this.maskPass.setSize(width, height);
    this.renderTargetFar.setSize(width, height);
    this.renderTargetCoC.setSize(width, height);
    this.renderTargetMasked.setSize(width, height);
    this.renderTarget.setSize(w2, h);
    this.renderTargetNear.setSize(w2, h);
    this.renderTargetCoCBlurred.setSize(w2, h);
    this.bokehNearBasePass.fullscreenMaterial.setSize(width, height);
    this.bokehNearFillPass.fullscreenMaterial.setSize(width, height);
    this.bokehFarBasePass.fullscreenMaterial.setSize(width, height);
    this.bokehFarFillPass.fullscreenMaterial.setSize(width, height);
  }
  /**
   * Performs initialization tasks.
   *
   * @param {WebGLRenderer} renderer - The renderer.
   * @param {Boolean} alpha - Whether the renderer uses the alpha channel or not.
   * @param {Number} frameBufferType - The type of the main frame buffers.
   */
  initialize(renderer, alpha, frameBufferType) {
    this.cocPass.initialize(renderer, alpha, frameBufferType);
    this.maskPass.initialize(renderer, alpha, frameBufferType);
    this.bokehNearBasePass.initialize(renderer, alpha, frameBufferType);
    this.bokehNearFillPass.initialize(renderer, alpha, frameBufferType);
    this.bokehFarBasePass.initialize(renderer, alpha, frameBufferType);
    this.bokehFarFillPass.initialize(renderer, alpha, frameBufferType);
    this.blurPass.initialize(renderer, alpha, UnsignedByteType);
    if (renderer.capabilities.logarithmicDepthBuffer) {
      this.cocPass.fullscreenMaterial.defines.LOG_DEPTH = "1";
    }
    if (frameBufferType !== void 0) {
      this.renderTarget.texture.type = frameBufferType;
      this.renderTargetNear.texture.type = frameBufferType;
      this.renderTargetFar.texture.type = frameBufferType;
      this.renderTargetMasked.texture.type = frameBufferType;
      if (renderer !== null && renderer.outputColorSpace === SRGBColorSpace) {
        this.renderTarget.texture.colorSpace = SRGBColorSpace;
        this.renderTargetNear.texture.colorSpace = SRGBColorSpace;
        this.renderTargetFar.texture.colorSpace = SRGBColorSpace;
        this.renderTargetMasked.texture.colorSpace = SRGBColorSpace;
      }
    }
  }
};
var dot_screen_default = `uniform vec2 angle;uniform float scale;float pattern(const in vec2 uv){vec2 point=scale*vec2(dot(angle.yx,vec2(uv.x,-uv.y)),dot(angle,uv));return(sin(point.x)*sin(point.y))*4.0;}void mainImage(const in vec4 inputColor,const in vec2 uv,out vec4 outputColor){vec3 color=vec3(inputColor.rgb*10.0-5.0+pattern(uv*resolution));outputColor=vec4(color,inputColor.a);}`;
var DotScreenEffect = class extends Effect {
  /**
   * Constructs a new dot screen effect.
   *
   * @param {Object} [options] - The options.
   * @param {BlendFunction} [options.blendFunction] - The blend function of this effect.
   * @param {Number} [options.angle=1.57] - The angle of the dot pattern.
   * @param {Number} [options.scale=1.0] - The scale of the dot pattern.
   */
  constructor({ blendFunction, angle = Math.PI * 0.5, scale: scale3 = 1 } = {}) {
    super("DotScreenEffect", dot_screen_default, {
      blendFunction,
      uniforms: /* @__PURE__ */ new Map([
        ["angle", new Uniform(new Vector2())],
        ["scale", new Uniform(scale3)]
      ])
    });
    this.angle = angle;
  }
  /**
   * The angle.
   *
   * @type {Number}
   */
  get angle() {
    return Math.acos(this.uniforms.get("angle").value.y);
  }
  set angle(value) {
    this.uniforms.get("angle").value.set(Math.sin(value), Math.cos(value));
  }
  /**
   * Returns the pattern angle.
   *
   * @deprecated Use angle instead.
   * @return {Number} The angle in radians.
   */
  getAngle() {
    return this.angle;
  }
  /**
   * Sets the pattern angle.
   *
   * @deprecated Use angle instead.
   * @param {Number} value - The angle in radians.
   */
  setAngle(value) {
    this.angle = value;
  }
  /**
   * The scale.
   *
   * @type {Number}
   */
  get scale() {
    return this.uniforms.get("scale").value;
  }
  set scale(value) {
    this.uniforms.get("scale").value = value;
  }
};
var fxaa_default = `#define QUALITY(q) ((q) < 5 ? 1.0 : ((q) > 5 ? ((q) < 10 ? 2.0 : ((q) < 11 ? 4.0 : 8.0)) : 1.5))
#define ONE_OVER_TWELVE 0.08333333333333333
varying vec2 vUvDown;varying vec2 vUvUp;varying vec2 vUvLeft;varying vec2 vUvRight;varying vec2 vUvDownLeft;varying vec2 vUvUpRight;varying vec2 vUvUpLeft;varying vec2 vUvDownRight;vec4 fxaa(const in vec4 inputColor,const in vec2 uv){float lumaCenter=luminance(inputColor.rgb);float lumaDown=luminance(texture2D(inputBuffer,vUvDown).rgb);float lumaUp=luminance(texture2D(inputBuffer,vUvUp).rgb);float lumaLeft=luminance(texture2D(inputBuffer,vUvLeft).rgb);float lumaRight=luminance(texture2D(inputBuffer,vUvRight).rgb);float lumaMin=min(lumaCenter,min(min(lumaDown,lumaUp),min(lumaLeft,lumaRight)));float lumaMax=max(lumaCenter,max(max(lumaDown,lumaUp),max(lumaLeft,lumaRight)));float lumaRange=lumaMax-lumaMin;if(lumaRange<max(EDGE_THRESHOLD_MIN,lumaMax*EDGE_THRESHOLD_MAX)){return inputColor;}float lumaDownLeft=luminance(texture2D(inputBuffer,vUvDownLeft).rgb);float lumaUpRight=luminance(texture2D(inputBuffer,vUvUpRight).rgb);float lumaUpLeft=luminance(texture2D(inputBuffer,vUvUpLeft).rgb);float lumaDownRight=luminance(texture2D(inputBuffer,vUvDownRight).rgb);float lumaDownUp=lumaDown+lumaUp;float lumaLeftRight=lumaLeft+lumaRight;float lumaLeftCorners=lumaDownLeft+lumaUpLeft;float lumaDownCorners=lumaDownLeft+lumaDownRight;float lumaRightCorners=lumaDownRight+lumaUpRight;float lumaUpCorners=lumaUpRight+lumaUpLeft;float edgeHorizontal=(abs(-2.0*lumaLeft+lumaLeftCorners)+abs(-2.0*lumaCenter+lumaDownUp)*2.0+abs(-2.0*lumaRight+lumaRightCorners));float edgeVertical=(abs(-2.0*lumaUp+lumaUpCorners)+abs(-2.0*lumaCenter+lumaLeftRight)*2.0+abs(-2.0*lumaDown+lumaDownCorners));bool isHorizontal=(edgeHorizontal>=edgeVertical);float stepLength=isHorizontal?texelSize.y:texelSize.x;float luma1=isHorizontal?lumaDown:lumaLeft;float luma2=isHorizontal?lumaUp:lumaRight;float gradient1=abs(luma1-lumaCenter);float gradient2=abs(luma2-lumaCenter);bool is1Steepest=gradient1>=gradient2;float gradientScaled=0.25*max(gradient1,gradient2);float lumaLocalAverage=0.0;if(is1Steepest){stepLength=-stepLength;lumaLocalAverage=0.5*(luma1+lumaCenter);}else{lumaLocalAverage=0.5*(luma2+lumaCenter);}vec2 currentUv=uv;if(isHorizontal){currentUv.y+=stepLength*0.5;}else{currentUv.x+=stepLength*0.5;}vec2 offset=isHorizontal?vec2(texelSize.x,0.0):vec2(0.0,texelSize.y);vec2 uv1=currentUv-offset*QUALITY(0);vec2 uv2=currentUv+offset*QUALITY(0);float lumaEnd1=luminance(texture2D(inputBuffer,uv1).rgb);float lumaEnd2=luminance(texture2D(inputBuffer,uv2).rgb);lumaEnd1-=lumaLocalAverage;lumaEnd2-=lumaLocalAverage;bool reached1=abs(lumaEnd1)>=gradientScaled;bool reached2=abs(lumaEnd2)>=gradientScaled;bool reachedBoth=reached1&&reached2;if(!reached1){uv1-=offset*QUALITY(1);}if(!reached2){uv2+=offset*QUALITY(1);}if(!reachedBoth){for(int i=2;i<SAMPLES;++i){if(!reached1){lumaEnd1=luminance(texture2D(inputBuffer,uv1).rgb);lumaEnd1=lumaEnd1-lumaLocalAverage;}if(!reached2){lumaEnd2=luminance(texture2D(inputBuffer,uv2).rgb);lumaEnd2=lumaEnd2-lumaLocalAverage;}reached1=abs(lumaEnd1)>=gradientScaled;reached2=abs(lumaEnd2)>=gradientScaled;reachedBoth=reached1&&reached2;if(!reached1){uv1-=offset*QUALITY(i);}if(!reached2){uv2+=offset*QUALITY(i);}if(reachedBoth){break;}}}float distance1=isHorizontal?(uv.x-uv1.x):(uv.y-uv1.y);float distance2=isHorizontal?(uv2.x-uv.x):(uv2.y-uv.y);bool isDirection1=distance1<distance2;float distanceFinal=min(distance1,distance2);float edgeThickness=(distance1+distance2);bool isLumaCenterSmaller=lumaCenter<lumaLocalAverage;bool correctVariation1=(lumaEnd1<0.0)!=isLumaCenterSmaller;bool correctVariation2=(lumaEnd2<0.0)!=isLumaCenterSmaller;bool correctVariation=isDirection1?correctVariation1:correctVariation2;float pixelOffset=-distanceFinal/edgeThickness+0.5;float finalOffset=correctVariation?pixelOffset:0.0;float lumaAverage=ONE_OVER_TWELVE*(2.0*(lumaDownUp+lumaLeftRight)+lumaLeftCorners+lumaRightCorners);float subPixelOffset1=clamp(abs(lumaAverage-lumaCenter)/lumaRange,0.0,1.0);float subPixelOffset2=(-2.0*subPixelOffset1+3.0)*subPixelOffset1*subPixelOffset1;float subPixelOffsetFinal=subPixelOffset2*subPixelOffset2*SUBPIXEL_QUALITY;finalOffset=max(finalOffset,subPixelOffsetFinal);vec2 finalUv=uv;if(isHorizontal){finalUv.y+=finalOffset*stepLength;}else{finalUv.x+=finalOffset*stepLength;}return texture2D(inputBuffer,finalUv);}void mainImage(const in vec4 inputColor,const in vec2 uv,out vec4 outputColor){outputColor=fxaa(inputColor,uv);}`;
var fxaa_default2 = `varying vec2 vUvDown;varying vec2 vUvUp;varying vec2 vUvLeft;varying vec2 vUvRight;varying vec2 vUvDownLeft;varying vec2 vUvUpRight;varying vec2 vUvUpLeft;varying vec2 vUvDownRight;void mainSupport(const in vec2 uv){vUvDown=uv+vec2(0.0,-1.0)*texelSize;vUvUp=uv+vec2(0.0,1.0)*texelSize;vUvRight=uv+vec2(1.0,0.0)*texelSize;vUvLeft=uv+vec2(-1.0,0.0)*texelSize;vUvDownLeft=uv+vec2(-1.0,-1.0)*texelSize;vUvUpRight=uv+vec2(1.0,1.0)*texelSize;vUvUpLeft=uv+vec2(-1.0,1.0)*texelSize;vUvDownRight=uv+vec2(1.0,-1.0)*texelSize;}`;
var FXAAEffect = class extends Effect {
  /**
   * Constructs a new FXAA effect.
   *
   * @param {Object} [options] - The options.
   * @param {BlendFunction} [options.blendFunction=BlendFunction.SRC] - The blend function of this effect.
   */
  constructor({ blendFunction = BlendFunction.SRC } = {}) {
    super("FXAAEffect", fxaa_default, {
      vertexShader: fxaa_default2,
      blendFunction,
      defines: /* @__PURE__ */ new Map([
        ["EDGE_THRESHOLD_MIN", "0.0312"],
        ["EDGE_THRESHOLD_MAX", "0.125"],
        ["SUBPIXEL_QUALITY", "0.75"],
        ["SAMPLES", "12"]
      ])
    });
  }
  /**
   * The minimum edge detection threshold. Range is [0.0, 1.0].
   *
   * @type {Number}
   */
  get minEdgeThreshold() {
    return Number(this.defines.get("EDGE_THRESHOLD_MIN"));
  }
  set minEdgeThreshold(value) {
    this.defines.set("EDGE_THRESHOLD_MIN", value.toFixed(12));
    this.setChanged();
  }
  /**
   * The maximum edge detection threshold. Range is [0.0, 1.0].
   *
   * @type {Number}
   */
  get maxEdgeThreshold() {
    return Number(this.defines.get("EDGE_THRESHOLD_MAX"));
  }
  set maxEdgeThreshold(value) {
    this.defines.set("EDGE_THRESHOLD_MAX", value.toFixed(12));
    this.setChanged();
  }
  /**
   * The subpixel blend quality. Range is [0.0, 1.0].
   *
   * @type {Number}
   */
  get subpixelQuality() {
    return Number(this.defines.get("SUBPIXEL_QUALITY"));
  }
  set subpixelQuality(value) {
    this.defines.set("SUBPIXEL_QUALITY", value.toFixed(12));
    this.setChanged();
  }
  /**
   * The maximum amount of edge detection samples.
   *
   * @type {Number}
   */
  get samples() {
    return Number(this.defines.get("SAMPLES"));
  }
  set samples(value) {
    this.defines.set("SAMPLES", value.toFixed(0));
    this.setChanged();
  }
};
var GlitchMode = {
  DISABLED: 0,
  SPORADIC: 1,
  CONSTANT_MILD: 2,
  CONSTANT_WILD: 3
};
function getNoise(size, format, type) {
  const channels = /* @__PURE__ */ new Map([
    [RedFormat, 1],
    [RGFormat, 2],
    [RGBAFormat, 4]
  ]);
  let data;
  if (!channels.has(format)) {
    console.error("Invalid noise texture format");
  }
  if (type === UnsignedByteType) {
    data = new Uint8Array(size * channels.get(format));
    for (let i = 0, l = data.length; i < l; ++i) {
      data[i] = Math.random() * 255 + 0.5;
    }
  } else {
    data = new Float32Array(size * channels.get(format));
    for (let i = 0, l = data.length; i < l; ++i) {
      data[i] = Math.random();
    }
  }
  return data;
}
var NoiseTexture = class extends DataTexture {
  /**
   * Constructs a new noise texture.
   *
   * Supported formats are `RGBAFormat`, `RedFormat` and `RGFormat`.
   *
   * @param {Number} width - The width.
   * @param {Number} height - The height.
   * @param {Number} [format=RedFormat] - The texture format.
   * @param {Number} [type=UnsignedByteType] - The texture type.
   */
  constructor(width, height, format = RedFormat, type = UnsignedByteType) {
    super(getNoise(width * height, format, type), width, height, format, type);
    this.needsUpdate = true;
  }
};
var glitch_default = `uniform lowp sampler2D perturbationMap;uniform bool active;uniform float columns;uniform float random;uniform vec2 seeds;uniform vec2 distortion;void mainUv(inout vec2 uv){if(active){if(uv.y<distortion.x+columns&&uv.y>distortion.x-columns*random){float sx=clamp(ceil(seeds.x),0.0,1.0);uv.y=sx*(1.0-(uv.y+distortion.y))+(1.0-sx)*distortion.y;}if(uv.x<distortion.y+columns&&uv.x>distortion.y-columns*random){float sy=clamp(ceil(seeds.y),0.0,1.0);uv.x=sy*distortion.x+(1.0-sy)*(1.0-(uv.x+distortion.x));}vec2 normal=texture2D(perturbationMap,uv*random*random).rg;uv+=normal*seeds*(random*0.2);}}`;
var textureTag = "Glitch.Generated";
function randomFloat(low, high) {
  return low + Math.random() * (high - low);
}
var GlitchEffect = class extends Effect {
  /**
   * Constructs a new glitch effect.
   *
   * TODO Change ratio to 0.15.
   * @param {Object} [options] - The options.
   * @param {Vector2} [options.chromaticAberrationOffset] - A chromatic aberration offset. If provided, the glitch effect will influence this offset.
   * @param {Vector2} [options.delay] - The minimum and maximum delay between glitch activations in seconds.
   * @param {Vector2} [options.duration] - The minimum and maximum duration of a glitch in seconds.
   * @param {Vector2} [options.strength] - The strength of weak and strong glitches.
   * @param {Texture} [options.perturbationMap] - A perturbation map. If none is provided, a noise texture will be created.
   * @param {Number} [options.dtSize=64] - The size of the generated noise map. Will be ignored if a perturbation map is provided.
   * @param {Number} [options.columns=0.05] - The scale of the blocky glitch columns.
   * @param {Number} [options.ratio=0.85] - The threshold for strong glitches.
   */
  constructor({
    chromaticAberrationOffset = null,
    delay = new Vector2(1.5, 3.5),
    duration = new Vector2(0.6, 1),
    strength = new Vector2(0.3, 1),
    columns = 0.05,
    ratio = 0.85,
    perturbationMap = null,
    dtSize = 64
  } = {}) {
    super("GlitchEffect", glitch_default, {
      uniforms: /* @__PURE__ */ new Map([
        ["perturbationMap", new Uniform(null)],
        ["columns", new Uniform(columns)],
        ["active", new Uniform(false)],
        ["random", new Uniform(1)],
        ["seeds", new Uniform(new Vector2())],
        ["distortion", new Uniform(new Vector2())]
      ])
    });
    if (perturbationMap === null) {
      const map2 = new NoiseTexture(dtSize, dtSize, RGBAFormat);
      map2.name = textureTag;
      this.perturbationMap = map2;
    } else {
      this.perturbationMap = perturbationMap;
    }
    this.time = 0;
    this.distortion = this.uniforms.get("distortion").value;
    this.delay = delay;
    this.duration = duration;
    this.breakPoint = new Vector2(
      randomFloat(this.delay.x, this.delay.y),
      randomFloat(this.duration.x, this.duration.y)
    );
    this.strength = strength;
    this.mode = GlitchMode.SPORADIC;
    this.ratio = ratio;
    this.chromaticAberrationOffset = chromaticAberrationOffset;
  }
  /**
   * Random number seeds.
   *
   * @type {Vector2}
   * @private
   */
  get seeds() {
    return this.uniforms.get("seeds").value;
  }
  /**
   * Indicates whether the glitch effect is currently active.
   *
   * @type {Boolean}
   */
  get active() {
    return this.uniforms.get("active").value;
  }
  /**
   * Indicates whether the glitch effect is currently active.
   *
   * @deprecated Use active instead.
   * @return {Boolean} Whether the glitch effect is active.
   */
  isActive() {
    return this.active;
  }
  /**
   * The minimum delay between glitch activations.
   *
   * @type {Number}
   */
  get minDelay() {
    return this.delay.x;
  }
  set minDelay(value) {
    this.delay.x = value;
  }
  /**
   * Returns the minimum delay between glitch activations.
   *
   * @deprecated Use minDelay instead.
   * @return {Number} The minimum delay in seconds.
   */
  getMinDelay() {
    return this.delay.x;
  }
  /**
   * Sets the minimum delay between glitch activations.
   *
   * @deprecated Use minDelay instead.
   * @param {Number} value - The minimum delay in seconds.
   */
  setMinDelay(value) {
    this.delay.x = value;
  }
  /**
   * The maximum delay between glitch activations.
   *
   * @type {Number}
   */
  get maxDelay() {
    return this.delay.y;
  }
  set maxDelay(value) {
    this.delay.y = value;
  }
  /**
   * Returns the maximum delay between glitch activations.
   *
   * @deprecated Use maxDelay instead.
   * @return {Number} The maximum delay in seconds.
   */
  getMaxDelay() {
    return this.delay.y;
  }
  /**
   * Sets the maximum delay between glitch activations.
   *
   * @deprecated Use maxDelay instead.
   * @param {Number} value - The maximum delay in seconds.
   */
  setMaxDelay(value) {
    this.delay.y = value;
  }
  /**
   * The minimum duration of sporadic glitches.
   *
   * @type {Number}
   */
  get minDuration() {
    return this.duration.x;
  }
  set minDuration(value) {
    this.duration.x = value;
  }
  /**
   * Returns the minimum duration of sporadic glitches.
   *
   * @deprecated Use minDuration instead.
   * @return {Number} The minimum duration in seconds.
   */
  getMinDuration() {
    return this.duration.x;
  }
  /**
   * Sets the minimum duration of sporadic glitches.
   *
   * @deprecated Use minDuration instead.
   * @param {Number} value - The minimum duration in seconds.
   */
  setMinDuration(value) {
    this.duration.x = value;
  }
  /**
   * The maximum duration of sporadic glitches.
   *
   * @type {Number}
   */
  get maxDuration() {
    return this.duration.y;
  }
  set maxDuration(value) {
    this.duration.y = value;
  }
  /**
   * Returns the maximum duration of sporadic glitches.
   *
   * @deprecated Use maxDuration instead.
   * @return {Number} The maximum duration in seconds.
   */
  getMaxDuration() {
    return this.duration.y;
  }
  /**
   * Sets the maximum duration of sporadic glitches.
   *
   * @deprecated Use maxDuration instead.
   * @param {Number} value - The maximum duration in seconds.
   */
  setMaxDuration(value) {
    this.duration.y = value;
  }
  /**
   * The strength of weak glitches.
   *
   * @type {Number}
   */
  get minStrength() {
    return this.strength.x;
  }
  set minStrength(value) {
    this.strength.x = value;
  }
  /**
   * Returns the strength of weak glitches.
   *
   * @deprecated Use minStrength instead.
   * @return {Number} The strength.
   */
  getMinStrength() {
    return this.strength.x;
  }
  /**
   * Sets the strength of weak glitches.
   *
   * @deprecated Use minStrength instead.
   * @param {Number} value - The strength.
   */
  setMinStrength(value) {
    this.strength.x = value;
  }
  /**
   * The strength of strong glitches.
   *
   * @type {Number}
   */
  get maxStrength() {
    return this.strength.y;
  }
  set maxStrength(value) {
    this.strength.y = value;
  }
  /**
   * Returns the strength of strong glitches.
   *
   * @deprecated Use maxStrength instead.
   * @return {Number} The strength.
   */
  getMaxStrength() {
    return this.strength.y;
  }
  /**
   * Sets the strength of strong glitches.
   *
   * @deprecated Use maxStrength instead.
   * @param {Number} value - The strength.
   */
  setMaxStrength(value) {
    this.strength.y = value;
  }
  /**
   * Returns the current glitch mode.
   *
   * @deprecated Use mode instead.
   * @return {GlitchMode} The mode.
   */
  getMode() {
    return this.mode;
  }
  /**
   * Sets the current glitch mode.
   *
   * @deprecated Use mode instead.
   * @param {GlitchMode} value - The mode.
   */
  setMode(value) {
    this.mode = value;
  }
  /**
   * Returns the glitch ratio.
   *
   * @deprecated Use ratio instead.
   * @return {Number} The ratio.
   */
  getGlitchRatio() {
    return 1 - this.ratio;
  }
  /**
   * Sets the ratio of weak (0.0) and strong (1.0) glitches.
   *
   * @deprecated Use ratio instead.
   * @param {Number} value - The ratio. Range is [0.0, 1.0].
   */
  setGlitchRatio(value) {
    this.ratio = Math.min(Math.max(1 - value, 0), 1);
  }
  /**
   * The glitch column size.
   *
   * @type {Number}
   */
  get columns() {
    return this.uniforms.get("columns").value;
  }
  set columns(value) {
    this.uniforms.get("columns").value = value;
  }
  /**
   * Returns the glitch column size.
   *
   * @deprecated Use columns instead.
   * @return {Number} The glitch column size.
   */
  getGlitchColumns() {
    return this.columns;
  }
  /**
   * Sets the glitch column size.
   *
   * @deprecated Use columns instead.
   * @param {Number} value - The glitch column size.
   */
  setGlitchColumns(value) {
    this.columns = value;
  }
  /**
   * Returns the chromatic aberration offset.
   *
   * @deprecated Use chromaticAberrationOffset instead.
   * @return {Vector2} The offset.
   */
  getChromaticAberrationOffset() {
    return this.chromaticAberrationOffset;
  }
  /**
   * Sets the chromatic aberration offset.
   *
   * @deprecated Use chromaticAberrationOffset instead.
   * @param {Vector2} value - The offset.
   */
  setChromaticAberrationOffset(value) {
    this.chromaticAberrationOffset = value;
  }
  /**
   * The perturbation map.
   *
   * @type {Texture}
   */
  get perturbationMap() {
    return this.uniforms.get("perturbationMap").value;
  }
  set perturbationMap(value) {
    const currentMap = this.perturbationMap;
    if (currentMap !== null && currentMap.name === textureTag) {
      currentMap.dispose();
    }
    value.minFilter = value.magFilter = NearestFilter;
    value.wrapS = value.wrapT = RepeatWrapping;
    value.generateMipmaps = false;
    this.uniforms.get("perturbationMap").value = value;
  }
  /**
   * Returns the current perturbation map.
   *
   * @deprecated Use perturbationMap instead.
   * @return {Texture} The current perturbation map.
   */
  getPerturbationMap() {
    return this.perturbationMap;
  }
  /**
   * Replaces the current perturbation map with the given one.
   *
   * The current map will be disposed if it was generated by this effect.
   *
   * @deprecated Use perturbationMap instead.
   * @param {Texture} value - The new perturbation map.
   */
  setPerturbationMap(value) {
    this.perturbationMap = value;
  }
  /**
   * Generates a perturbation map.
   *
   * @deprecated Use NoiseTexture instead.
   * @param {Number} [value=64] - The texture size.
   * @return {DataTexture} The perturbation map.
   */
  generatePerturbationMap(value = 64) {
    const map2 = new NoiseTexture(value, value, RGBAFormat);
    map2.name = textureTag;
    return map2;
  }
  /**
   * Updates this effect.
   *
   * @param {WebGLRenderer} renderer - The renderer.
   * @param {WebGLRenderTarget} inputBuffer - A frame buffer that contains the result of the previous pass.
   * @param {Number} [deltaTime] - The time between the last frame and the current one in seconds.
   */
  update(renderer, inputBuffer, deltaTime) {
    const mode = this.mode;
    const breakPoint = this.breakPoint;
    const offset = this.chromaticAberrationOffset;
    const s = this.strength;
    let time = this.time;
    let active = false;
    let r = 0, a = 0;
    let trigger;
    if (mode !== GlitchMode.DISABLED) {
      if (mode === GlitchMode.SPORADIC) {
        time += deltaTime;
        trigger = time > breakPoint.x;
        if (time >= breakPoint.x + breakPoint.y) {
          breakPoint.set(
            randomFloat(this.delay.x, this.delay.y),
            randomFloat(this.duration.x, this.duration.y)
          );
          time = 0;
        }
      }
      r = Math.random();
      this.uniforms.get("random").value = r;
      if (trigger && r > this.ratio || mode === GlitchMode.CONSTANT_WILD) {
        active = true;
        r *= s.y * 0.03;
        a = randomFloat(-Math.PI, Math.PI);
        this.seeds.set(randomFloat(-s.y, s.y), randomFloat(-s.y, s.y));
        this.distortion.set(randomFloat(0, 1), randomFloat(0, 1));
      } else if (trigger || mode === GlitchMode.CONSTANT_MILD) {
        active = true;
        r *= s.x * 0.03;
        a = randomFloat(-Math.PI, Math.PI);
        this.seeds.set(randomFloat(-s.x, s.x), randomFloat(-s.x, s.x));
        this.distortion.set(randomFloat(0, 1), randomFloat(0, 1));
      }
      this.time = time;
    }
    if (offset !== null) {
      if (active) {
        offset.set(Math.cos(a), Math.sin(a)).multiplyScalar(r);
      } else {
        offset.set(0, 0);
      }
    }
    this.uniforms.get("active").value = active;
  }
  /**
   * Deletes generated resources.
   */
  dispose() {
    const map2 = this.perturbationMap;
    if (map2 !== null && map2.name === textureTag) {
      map2.dispose();
    }
  }
};
var DepthTestStrategy = {
  DEFAULT: 0,
  KEEP_MAX_DEPTH: 1,
  DISCARD_MAX_DEPTH: 2
};
var depth_mask_default = `#include <common>
#include <packing>
#ifdef GL_FRAGMENT_PRECISION_HIGH
uniform highp sampler2D depthBuffer0;uniform highp sampler2D depthBuffer1;
#else
uniform mediump sampler2D depthBuffer0;uniform mediump sampler2D depthBuffer1;
#endif
uniform sampler2D inputBuffer;uniform vec2 cameraNearFar;float getViewZ(const in float depth){
#ifdef PERSPECTIVE_CAMERA
return perspectiveDepthToViewZ(depth,cameraNearFar.x,cameraNearFar.y);
#else
return orthographicDepthToViewZ(depth,cameraNearFar.x,cameraNearFar.y);
#endif
}varying vec2 vUv;void main(){vec2 depth;
#if DEPTH_PACKING_0 == 3201
depth.x=unpackRGBAToDepth(texture2D(depthBuffer0,vUv));
#else
depth.x=texture2D(depthBuffer0,vUv).r;
#ifdef LOG_DEPTH
float d=pow(2.0,depth.x*log2(cameraNearFar.y+1.0))-1.0;float a=cameraNearFar.y/(cameraNearFar.y-cameraNearFar.x);float b=cameraNearFar.y*cameraNearFar.x/(cameraNearFar.x-cameraNearFar.y);depth.x=a+b/d;
#endif
#endif
#if DEPTH_PACKING_1 == 3201
depth.y=unpackRGBAToDepth(texture2D(depthBuffer1,vUv));
#else
depth.y=texture2D(depthBuffer1,vUv).r;
#ifdef LOG_DEPTH
float d=pow(2.0,depth.y*log2(cameraNearFar.y+1.0))-1.0;float a=cameraNearFar.y/(cameraNearFar.y-cameraNearFar.x);float b=cameraNearFar.y*cameraNearFar.x/(cameraNearFar.x-cameraNearFar.y);depth.y=a+b/d;
#endif
#endif
bool isMaxDepth=(depth.x==1.0);
#ifdef PERSPECTIVE_CAMERA
depth.x=viewZToOrthographicDepth(getViewZ(depth.x),cameraNearFar.x,cameraNearFar.y);depth.y=viewZToOrthographicDepth(getViewZ(depth.y),cameraNearFar.x,cameraNearFar.y);
#endif
#if DEPTH_TEST_STRATEGY == 0
bool keep=depthTest(depth.x,depth.y);
#elif DEPTH_TEST_STRATEGY == 1
bool keep=isMaxDepth||depthTest(depth.x,depth.y);
#else
bool keep=!isMaxDepth&&depthTest(depth.x,depth.y);
#endif
if(keep){gl_FragColor=texture2D(inputBuffer,vUv);}else{discard;}}`;
var DepthMaskMaterial = class extends ShaderMaterial {
  /**
   * Constructs a new depth mask material.
   */
  constructor() {
    super({
      name: "DepthMaskMaterial",
      defines: {
        DEPTH_EPSILON: "0.0001",
        DEPTH_PACKING_0: "0",
        DEPTH_PACKING_1: "0",
        DEPTH_TEST_STRATEGY: DepthTestStrategy.KEEP_MAX_DEPTH
      },
      uniforms: {
        inputBuffer: new Uniform(null),
        depthBuffer0: new Uniform(null),
        depthBuffer1: new Uniform(null),
        cameraNearFar: new Uniform(new Vector2(1, 1))
      },
      blending: NoBlending,
      toneMapped: false,
      depthWrite: false,
      depthTest: false,
      fragmentShader: depth_mask_default,
      vertexShader: common_default
    });
    this.depthMode = LessDepth;
  }
  /**
   * The primary depth buffer.
   *
   * @type {Texture}
   */
  set depthBuffer0(value) {
    this.uniforms.depthBuffer0.value = value;
  }
  /**
   * The primary depth packing strategy.
   *
   * @type {DepthPackingStrategies}
   */
  set depthPacking0(value) {
    this.defines.DEPTH_PACKING_0 = value.toFixed(0);
    this.needsUpdate = true;
  }
  /**
   * Sets the base depth buffer.
   *
   * @deprecated Use depthBuffer0 and depthPacking0 instead.
   * @param {Texture} buffer - The depth texture.
   * @param {DepthPackingStrategies} [depthPacking=BasicDepthPacking] - The depth packing strategy.
   */
  setDepthBuffer0(buffer2, depthPacking = BasicDepthPacking) {
    this.depthBuffer0 = buffer2;
    this.depthPacking0 = depthPacking;
  }
  /**
   * The secondary depth buffer.
   *
   * @type {Texture}
   */
  set depthBuffer1(value) {
    this.uniforms.depthBuffer1.value = value;
  }
  /**
   * The secondary depth packing strategy.
   *
   * @type {DepthPackingStrategies}
   */
  set depthPacking1(value) {
    this.defines.DEPTH_PACKING_1 = value.toFixed(0);
    this.needsUpdate = true;
  }
  /**
   * Sets the depth buffer that will be compared with the base depth buffer.
   *
   * @deprecated Use depthBuffer1 and depthPacking1 instead.
   * @param {Texture} buffer - The depth texture.
   * @param {DepthPackingStrategies} [depthPacking=BasicDepthPacking] - The depth packing strategy.
   */
  setDepthBuffer1(buffer2, depthPacking = BasicDepthPacking) {
    this.depthBuffer1 = buffer2;
    this.depthPacking1 = depthPacking;
  }
  /**
   * The strategy for handling maximum depth.
   *
   * @type {DepthTestStrategy}
   */
  get maxDepthStrategy() {
    return Number(this.defines.DEPTH_TEST_STRATEGY);
  }
  set maxDepthStrategy(value) {
    this.defines.DEPTH_TEST_STRATEGY = value.toFixed(0);
    this.needsUpdate = true;
  }
  /**
   * Indicates whether maximum depth values should be preserved.
   *
   * @type {Boolean}
   * @deprecated Use maxDepthStrategy instead.
   */
  get keepFar() {
    return this.maxDepthStrategy;
  }
  set keepFar(value) {
    this.maxDepthStrategy = value ? DepthTestStrategy.KEEP_MAX_DEPTH : DepthTestStrategy.DISCARD_MAX_DEPTH;
  }
  /**
   * Returns the strategy for dealing with maximum depth values.
   *
   * @deprecated Use maxDepthStrategy instead.
   * @return {DepthTestStrategy} The strategy.
   */
  getMaxDepthStrategy() {
    return this.maxDepthStrategy;
  }
  /**
   * Sets the strategy for dealing with maximum depth values.
   *
   * @deprecated Use maxDepthStrategy instead.
   * @param {DepthTestStrategy} value - The strategy.
   */
  setMaxDepthStrategy(value) {
    this.maxDepthStrategy = value;
  }
  /**
   * A small error threshold that is used for `EqualDepth` and `NotEqualDepth` tests. Default is `1e-4`.
   *
   * @type {Number}
   */
  get epsilon() {
    return Number(this.defines.DEPTH_EPSILON);
  }
  set epsilon(value) {
    this.defines.DEPTH_EPSILON = value.toFixed(16);
    this.needsUpdate = true;
  }
  /**
   * Returns the current error threshold for depth comparisons.
   *
   * @deprecated Use epsilon instead.
   * @return {Number} The error threshold.
   */
  getEpsilon() {
    return this.epsilon;
  }
  /**
   * Sets the depth comparison error threshold.
   *
   * @deprecated Use epsilon instead.
   * @param {Number} value - The new error threshold.
   */
  setEpsilon(value) {
    this.epsilon = value;
  }
  /**
   * The depth mode.
   *
   * @see https://threejs.org/docs/#api/en/constants/Materials
   * @type {DepthModes}
   */
  get depthMode() {
    return Number(this.defines.DEPTH_MODE);
  }
  set depthMode(value) {
    let depthTest;
    switch (value) {
      case NeverDepth:
        depthTest = "false";
        break;
      case AlwaysDepth:
        depthTest = "true";
        break;
      case EqualDepth:
        depthTest = "abs(d1 - d0) <= DEPTH_EPSILON";
        break;
      case NotEqualDepth:
        depthTest = "abs(d1 - d0) > DEPTH_EPSILON";
        break;
      case LessDepth:
        depthTest = "d0 > d1";
        break;
      case LessEqualDepth:
        depthTest = "d0 >= d1";
        break;
      case GreaterEqualDepth:
        depthTest = "d0 <= d1";
        break;
      case GreaterDepth:
      default:
        depthTest = "d0 < d1";
        break;
    }
    this.defines.DEPTH_MODE = value.toFixed(0);
    this.defines["depthTest(d0, d1)"] = depthTest;
    this.needsUpdate = true;
  }
  /**
   * Returns the current depth mode.
   *
   * @deprecated Use depthMode instead.
   * @return {DepthModes} The depth mode. Default is `LessDepth`.
   */
  getDepthMode() {
    return this.depthMode;
  }
  /**
   * Sets the depth mode.
   *
   * @deprecated Use depthMode instead.
   * @param {DepthModes} mode - The depth mode.
   */
  setDepthMode(mode) {
    this.depthMode = mode;
  }
  /**
   * Copies the settings of the given camera.
   *
   * @deprecated Use copyCameraSettings instead.
   * @param {Camera} camera - A camera.
   */
  adoptCameraSettings(camera) {
    this.copyCameraSettings(camera);
  }
  /**
   * Copies the settings of the given camera.
   *
   * @param {Camera} camera - A camera.
   */
  copyCameraSettings(camera) {
    if (camera) {
      this.uniforms.cameraNearFar.value.set(camera.near, camera.far);
      if (camera instanceof PerspectiveCamera) {
        this.defines.PERSPECTIVE_CAMERA = "1";
      } else {
        delete this.defines.PERSPECTIVE_CAMERA;
      }
      this.needsUpdate = true;
    }
  }
};
var convolution_god_rays_default = `#include <common>
#include <dithering_pars_fragment>
#ifdef FRAMEBUFFER_PRECISION_HIGH
uniform mediump sampler2D inputBuffer;
#else
uniform lowp sampler2D inputBuffer;
#endif
uniform vec2 lightPosition;uniform float exposure;uniform float decay;uniform float density;uniform float weight;uniform float clampMax;varying vec2 vUv;void main(){vec2 coord=vUv;vec2 delta=lightPosition-coord;delta*=1.0/SAMPLES_FLOAT*density;float illuminationDecay=1.0;vec4 color=vec4(0.0);for(int i=0;i<SAMPLES_INT;++i){coord+=delta;vec4 texel=texture2D(inputBuffer,coord);texel*=illuminationDecay*weight;color+=texel;illuminationDecay*=decay;}gl_FragColor=clamp(color*exposure,0.0,clampMax);
#include <dithering_fragment>
}`;
var GodRaysMaterial = class extends ShaderMaterial {
  /**
   * Constructs a new god rays material.
   *
   * TODO Remove lightPosition param.
   * @param {Vector2} lightPosition - Deprecated.
   */
  constructor(lightPosition) {
    super({
      name: "GodRaysMaterial",
      defines: {
        SAMPLES_INT: "60",
        SAMPLES_FLOAT: "60.0"
      },
      uniforms: {
        inputBuffer: new Uniform(null),
        lightPosition: new Uniform(lightPosition),
        density: new Uniform(1),
        decay: new Uniform(1),
        weight: new Uniform(1),
        exposure: new Uniform(1),
        clampMax: new Uniform(1)
      },
      blending: NoBlending,
      toneMapped: false,
      depthWrite: false,
      depthTest: false,
      fragmentShader: convolution_god_rays_default,
      vertexShader: common_default
    });
  }
  /**
   * The input buffer.
   *
   * @type {Texture}
   */
  set inputBuffer(value) {
    this.uniforms.inputBuffer.value = value;
  }
  /**
   * Sets the input buffer.
   *
   * @deprecated Use inputBuffer instead.
   * @param {Texture} value - The input buffer.
   */
  setInputBuffer(value) {
    this.uniforms.inputBuffer.value = value;
  }
  /**
   * The screen space position of the light source.
   *
   * @type {Vector2}
   */
  get lightPosition() {
    return this.uniforms.lightPosition.value;
  }
  /**
   * Returns the screen space position of the light source.
   *
   * @deprecated Use lightPosition instead.
   * @return {Vector2} The position.
   */
  getLightPosition() {
    return this.uniforms.lightPosition.value;
  }
  /**
   * Sets the screen space position of the light source.
   *
   * @deprecated Use lightPosition instead.
   * @param {Vector2} value - The position.
   */
  setLightPosition(value) {
    this.uniforms.lightPosition.value = value;
  }
  /**
   * The density.
   *
   * @type {Number}
   */
  get density() {
    return this.uniforms.density.value;
  }
  set density(value) {
    this.uniforms.density.value = value;
  }
  /**
   * Returns the density.
   *
   * @deprecated Use density instead.
   * @return {Number} The density.
   */
  getDensity() {
    return this.uniforms.density.value;
  }
  /**
   * Sets the density.
   *
   * @deprecated Use density instead.
   * @param {Number} value - The density.
   */
  setDensity(value) {
    this.uniforms.density.value = value;
  }
  /**
   * The decay.
   *
   * @type {Number}
   */
  get decay() {
    return this.uniforms.decay.value;
  }
  set decay(value) {
    this.uniforms.decay.value = value;
  }
  /**
   * Returns the decay.
   *
   * @deprecated Use decay instead.
   * @return {Number} The decay.
   */
  getDecay() {
    return this.uniforms.decay.value;
  }
  /**
   * Sets the decay.
   *
   * @deprecated Use decay instead.
   * @param {Number} value - The decay.
   */
  setDecay(value) {
    this.uniforms.decay.value = value;
  }
  /**
   * The weight.
   *
   * @type {Number}
   */
  get weight() {
    return this.uniforms.weight.value;
  }
  set weight(value) {
    this.uniforms.weight.value = value;
  }
  /**
   * Returns the weight.
   *
   * @deprecated Use weight instead.
   * @return {Number} The weight.
   */
  getWeight() {
    return this.uniforms.weight.value;
  }
  /**
   * Sets the weight.
   *
   * @deprecated Use weight instead.
   * @param {Number} value - The weight.
   */
  setWeight(value) {
    this.uniforms.weight.value = value;
  }
  /**
   * The exposure.
   *
   * @type {Number}
   */
  get exposure() {
    return this.uniforms.exposure.value;
  }
  set exposure(value) {
    this.uniforms.exposure.value = value;
  }
  /**
   * Returns the exposure.
   *
   * @deprecated Use exposure instead.
   * @return {Number} The exposure.
   */
  getExposure() {
    return this.uniforms.exposure.value;
  }
  /**
   * Sets the exposure.
   *
   * @deprecated Use exposure instead.
   * @param {Number} value - The exposure.
   */
  setExposure(value) {
    this.uniforms.exposure.value = value;
  }
  /**
   * The maximum light intensity.
   *
   * @type {Number}
   */
  get maxIntensity() {
    return this.uniforms.clampMax.value;
  }
  set maxIntensity(value) {
    this.uniforms.clampMax.value = value;
  }
  /**
   * Returns the maximum light intensity.
   *
   * @deprecated Use maxIntensity instead.
   * @return {Number} The maximum light intensity.
   */
  getMaxIntensity() {
    return this.uniforms.clampMax.value;
  }
  /**
   * Sets the maximum light intensity.
   *
   * @deprecated Use maxIntensity instead.
   * @param {Number} value - The maximum light intensity.
   */
  setMaxIntensity(value) {
    this.uniforms.clampMax.value = value;
  }
  /**
   * The amount of samples per pixel.
   *
   * @type {Number}
   */
  get samples() {
    return Number(this.defines.SAMPLES_INT);
  }
  set samples(value) {
    const s = Math.floor(value);
    this.defines.SAMPLES_INT = s.toFixed(0);
    this.defines.SAMPLES_FLOAT = s.toFixed(1);
    this.needsUpdate = true;
  }
  /**
   * Returns the amount of samples per pixel.
   *
   * @deprecated Use samples instead.
   * @return {Number} The sample count.
   */
  getSamples() {
    return this.samples;
  }
  /**
   * Sets the amount of samples per pixel.
   *
   * @deprecated Use samples instead.
   * @param {Number} value - The sample count.
   */
  setSamples(value) {
    this.samples = value;
  }
};
var RenderPass = class extends Pass {
  /**
   * Constructs a new render pass.
   *
   * @param {Scene} scene - The scene to render.
   * @param {Camera} camera - The camera to use to render the scene.
   * @param {Material} [overrideMaterial=null] - An override material.
   */
  constructor(scene, camera, overrideMaterial = null) {
    super("RenderPass", scene, camera);
    this.needsSwap = false;
    this.clearPass = new ClearPass();
    this.overrideMaterialManager = overrideMaterial === null ? null : new OverrideMaterialManager(overrideMaterial);
    this.ignoreBackground = false;
    this.skipShadowMapUpdate = false;
    this.selection = null;
  }
  set mainScene(value) {
    this.scene = value;
  }
  set mainCamera(value) {
    this.camera = value;
  }
  get renderToScreen() {
    return super.renderToScreen;
  }
  set renderToScreen(value) {
    super.renderToScreen = value;
    this.clearPass.renderToScreen = value;
  }
  /**
   * The current override material.
   *
   * @type {Material}
   */
  get overrideMaterial() {
    const manager = this.overrideMaterialManager;
    return manager !== null ? manager.material : null;
  }
  set overrideMaterial(value) {
    const manager = this.overrideMaterialManager;
    if (value !== null) {
      if (manager !== null) {
        manager.setMaterial(value);
      } else {
        this.overrideMaterialManager = new OverrideMaterialManager(value);
      }
    } else if (manager !== null) {
      manager.dispose();
      this.overrideMaterialManager = null;
    }
  }
  /**
   * Returns the current override material.
   *
   * @deprecated Use overrideMaterial instead.
   * @return {Material} The material.
   */
  getOverrideMaterial() {
    return this.overrideMaterial;
  }
  /**
   * Sets the override material.
   *
   * @deprecated Use overrideMaterial instead.
   * @return {Material} value - The material.
   */
  setOverrideMaterial(value) {
    this.overrideMaterial = value;
  }
  /**
   * Indicates whether the target buffer should be cleared before rendering.
   *
   * @type {Boolean}
   * @deprecated Use clearPass.enabled instead.
   */
  get clear() {
    return this.clearPass.enabled;
  }
  set clear(value) {
    this.clearPass.enabled = value;
  }
  /**
   * Returns the selection. Default is `null` (no restriction).
   *
   * @deprecated Use selection instead.
   * @return {Selection} The selection.
   */
  getSelection() {
    return this.selection;
  }
  /**
   * Sets the selection. Set to `null` to disable.
   *
   * @deprecated Use selection instead.
   * @param {Selection} value - The selection.
   */
  setSelection(value) {
    this.selection = value;
  }
  /**
   * Indicates whether the scene background is disabled.
   *
   * @deprecated Use ignoreBackground instead.
   * @return {Boolean} Whether the scene background is disabled.
   */
  isBackgroundDisabled() {
    return this.ignoreBackground;
  }
  /**
   * Enables or disables the scene background.
   *
   * @deprecated Use ignoreBackground instead.
   * @param {Boolean} value - Whether the scene background should be disabled.
   */
  setBackgroundDisabled(value) {
    this.ignoreBackground = value;
  }
  /**
   * Indicates whether the shadow map auto update is disabled.
   *
   * @deprecated Use skipShadowMapUpdate instead.
   * @return {Boolean} Whether the shadow map update is disabled.
   */
  isShadowMapDisabled() {
    return this.skipShadowMapUpdate;
  }
  /**
   * Enables or disables the shadow map auto update.
   *
   * @deprecated Use skipShadowMapUpdate instead.
   * @param {Boolean} value - Whether the shadow map auto update should be disabled.
   */
  setShadowMapDisabled(value) {
    this.skipShadowMapUpdate = value;
  }
  /**
   * Returns the clear pass.
   *
   * @deprecated Use clearPass.enabled instead.
   * @return {ClearPass} The clear pass.
   */
  getClearPass() {
    return this.clearPass;
  }
  /**
   * Renders the scene.
   *
   * @param {WebGLRenderer} renderer - The renderer.
   * @param {WebGLRenderTarget} inputBuffer - A frame buffer that contains the result of the previous pass.
   * @param {WebGLRenderTarget} outputBuffer - A frame buffer that serves as the output render target unless this pass renders to screen.
   * @param {Number} [deltaTime] - The time between the last frame and the current one in seconds.
   * @param {Boolean} [stencilTest] - Indicates whether a stencil mask is active.
   */
  render(renderer, inputBuffer, outputBuffer, deltaTime, stencilTest) {
    const scene = this.scene;
    const camera = this.camera;
    const selection = this.selection;
    const mask = camera.layers.mask;
    const background = scene.background;
    const shadowMapAutoUpdate = renderer.shadowMap.autoUpdate;
    const renderTarget = this.renderToScreen ? null : inputBuffer;
    if (selection !== null) {
      camera.layers.set(selection.getLayer());
    }
    if (this.skipShadowMapUpdate) {
      renderer.shadowMap.autoUpdate = false;
    }
    if (this.ignoreBackground || this.clearPass.overrideClearColor !== null) {
      scene.background = null;
    }
    if (this.clearPass.enabled) {
      this.clearPass.render(renderer, inputBuffer);
    }
    renderer.setRenderTarget(renderTarget);
    if (this.overrideMaterialManager !== null) {
      this.overrideMaterialManager.render(renderer, scene, camera);
    } else {
      renderer.render(scene, camera);
    }
    camera.layers.mask = mask;
    scene.background = background;
    renderer.shadowMap.autoUpdate = shadowMapAutoUpdate;
  }
};
var god_rays_default = `#ifdef FRAMEBUFFER_PRECISION_HIGH
uniform mediump sampler2D map;
#else
uniform lowp sampler2D map;
#endif
void mainImage(const in vec4 inputColor,const in vec2 uv,out vec4 outputColor){outputColor=texture2D(map,uv);}`;
var v = new Vector3();
var m = new Matrix4();
var GodRaysEffect = class extends Effect {
  /**
   * Constructs a new god rays effect.
   *
   * @param {Camera} [camera] - The main camera.
   * @param {Mesh|Points} [lightSource] - The light source. Must not write depth and has to be flagged as transparent.
   * @param {Object} [options] - The options.
   * @param {BlendFunction} [options.blendFunction=BlendFunction.SCREEN] - The blend function of this effect.
   * @param {Number} [options.samples=60.0] - The number of samples per pixel.
   * @param {Number} [options.density=0.96] - The density of the light rays.
   * @param {Number} [options.decay=0.9] - An illumination decay factor.
   * @param {Number} [options.weight=0.4] - A light ray weight factor.
   * @param {Number} [options.exposure=0.6] - A constant attenuation coefficient.
   * @param {Number} [options.clampMax=1.0] - An upper bound for the saturation of the overall effect.
   * @param {Number} [options.resolutionScale=0.5] - The resolution scale.
   * @param {Number} [options.resolutionX=Resolution.AUTO_SIZE] - The horizontal resolution.
   * @param {Number} [options.resolutionY=Resolution.AUTO_SIZE] - The vertical resolution.
   * @param {Number} [options.width=Resolution.AUTO_SIZE] - Deprecated. Use resolutionX instead.
   * @param {Number} [options.height=Resolution.AUTO_SIZE] - Deprecated. Use resolutionY instead.
   * @param {KernelSize} [options.kernelSize=KernelSize.SMALL] - The blur kernel size. Has no effect if blur is disabled.
   * @param {Boolean} [options.blur=true] - Whether the god rays should be blurred to reduce artifacts.
   */
  constructor(camera, lightSource, {
    blendFunction = BlendFunction.SCREEN,
    samples = 60,
    density = 0.96,
    decay = 0.9,
    weight = 0.4,
    exposure = 0.6,
    clampMax = 1,
    blur = true,
    kernelSize = KernelSize.SMALL,
    resolutionScale = 0.5,
    width = Resolution.AUTO_SIZE,
    height = Resolution.AUTO_SIZE,
    resolutionX = width,
    resolutionY = height
  } = {}) {
    super("GodRaysEffect", god_rays_default, {
      blendFunction,
      attributes: EffectAttribute.DEPTH,
      uniforms: /* @__PURE__ */ new Map([
        ["map", new Uniform(null)]
      ])
    });
    this.camera = camera;
    this._lightSource = lightSource;
    this.lightSource = lightSource;
    this.lightScene = new Scene();
    this.screenPosition = new Vector2();
    this.renderTargetA = new WebGLRenderTarget(1, 1, { depthBuffer: false });
    this.renderTargetA.texture.name = "GodRays.Target.A";
    this.renderTargetB = this.renderTargetA.clone();
    this.renderTargetB.texture.name = "GodRays.Target.B";
    this.uniforms.get("map").value = this.renderTargetB.texture;
    this.renderTargetLight = new WebGLRenderTarget(1, 1);
    this.renderTargetLight.texture.name = "GodRays.Light";
    this.renderTargetLight.depthTexture = new DepthTexture();
    this.renderPassLight = new RenderPass(this.lightScene, camera);
    this.renderPassLight.clearPass.overrideClearColor = new Color(0);
    this.clearPass = new ClearPass(true, false, false);
    this.clearPass.overrideClearColor = new Color(0);
    this.blurPass = new KawaseBlurPass({ kernelSize });
    this.blurPass.enabled = blur;
    this.depthMaskPass = new ShaderPass(new DepthMaskMaterial());
    const depthMaskMaterial = this.depthMaskMaterial;
    depthMaskMaterial.depthBuffer1 = this.renderTargetLight.depthTexture;
    depthMaskMaterial.copyCameraSettings(camera);
    this.godRaysPass = new ShaderPass(new GodRaysMaterial(this.screenPosition));
    const godRaysMaterial = this.godRaysMaterial;
    godRaysMaterial.density = density;
    godRaysMaterial.decay = decay;
    godRaysMaterial.weight = weight;
    godRaysMaterial.exposure = exposure;
    godRaysMaterial.maxIntensity = clampMax;
    godRaysMaterial.samples = samples;
    const resolution = this.resolution = new Resolution(this, resolutionX, resolutionY, resolutionScale);
    resolution.addEventListener("change", (e) => this.setSize(resolution.baseWidth, resolution.baseHeight));
  }
  set mainCamera(value) {
    this.camera = value;
    this.renderPassLight.mainCamera = value;
    this.depthMaskMaterial.copyCameraSettings(value);
  }
  /**
   * Sets the light source.
   *
   * @type {Mesh|Points}
   */
  get lightSource() {
    return this._lightSource;
  }
  set lightSource(value) {
    this._lightSource = value;
    if (value !== null) {
      value.material.depthWrite = false;
      value.material.transparent = true;
    }
  }
  /**
   * Returns the blur pass that reduces aliasing artifacts and makes the light softer.
   *
   * @deprecated Use blurPass instead.
   * @return {KawaseBlurPass} The blur pass.
   */
  getBlurPass() {
    return this.blurPass;
  }
  /**
   * A texture that contains the intermediate result of this effect.
   *
   * @type {Texture}
   */
  get texture() {
    return this.renderTargetB.texture;
  }
  /**
   * Returns the god rays texture.
   *
   * @deprecated Use texture instead.
   * @return {Texture} The texture.
   */
  getTexture() {
    return this.texture;
  }
  /**
   * The depth mask material.
   *
   * @type {DepthMaskMaterial}
   * @private
   */
  get depthMaskMaterial() {
    return this.depthMaskPass.fullscreenMaterial;
  }
  /**
   * The internal god rays material.
   *
   * @type {GodRaysMaterial}
   */
  get godRaysMaterial() {
    return this.godRaysPass.fullscreenMaterial;
  }
  /**
   * Returns the god rays material.
   *
   * @deprecated Use godRaysMaterial instead.
   * @return {GodRaysMaterial} The material.
   */
  getGodRaysMaterial() {
    return this.godRaysMaterial;
  }
  /**
   * Returns the resolution of this effect.
   *
   * @deprecated Use resolution instead.
   * @return {GodRaysMaterial} The material.
   */
  getResolution() {
    return this.resolution;
  }
  /**
   * The current width of the internal render targets.
   *
   * @type {Number}
   * @deprecated Use resolution.width instead.
   */
  get width() {
    return this.resolution.width;
  }
  set width(value) {
    this.resolution.preferredWidth = value;
  }
  /**
   * The current height of the internal render targets.
   *
   * @type {Number}
   * @deprecated Use resolution.height instead.
   */
  get height() {
    return this.resolution.height;
  }
  set height(value) {
    this.resolution.preferredHeight = value;
  }
  /**
   * Indicates whether dithering is enabled.
   *
   * @type {Boolean}
   * @deprecated
   */
  get dithering() {
    return this.godRaysMaterial.dithering;
  }
  set dithering(value) {
    const material = this.godRaysMaterial;
    material.dithering = value;
    material.needsUpdate = true;
  }
  /**
   * Indicates whether the god rays should be blurred to reduce artifacts.
   *
   * @type {Boolean}
   * @deprecated Use blurPass.enabled instead.
   */
  get blur() {
    return this.blurPass.enabled;
  }
  set blur(value) {
    this.blurPass.enabled = value;
  }
  /**
   * The blur kernel size.
   *
   * @type {KernelSize}
   * @deprecated Use blurPass.kernelSize instead.
   */
  get kernelSize() {
    return this.blurPass.kernelSize;
  }
  set kernelSize(value) {
    this.blurPass.kernelSize = value;
  }
  /**
   * Returns the current resolution scale.
   *
   * @return {Number} The resolution scale.
   * @deprecated Use resolution instead.
   */
  getResolutionScale() {
    return this.resolution.scale;
  }
  /**
   * Sets the resolution scale.
   *
   * @param {Number} scale - The new resolution scale.
   * @deprecated Use resolution instead.
   */
  setResolutionScale(scale3) {
    this.resolution.scale = scale3;
  }
  /**
   * The number of samples per pixel.
   *
   * @type {Number}
   * @deprecated Use godRaysMaterial.samples instead.
   */
  get samples() {
    return this.godRaysMaterial.samples;
  }
  /**
   * A higher sample count improves quality at the cost of performance.
   *
   * @type {Number}
   * @deprecated Use godRaysMaterial.samples instead.
   */
  set samples(value) {
    this.godRaysMaterial.samples = value;
  }
  /**
   * Sets the depth texture.
   *
   * @param {Texture} depthTexture - A depth texture.
   * @param {Number} [depthPacking=BasicDepthPacking] - The depth packing.
   */
  setDepthTexture(depthTexture, depthPacking = BasicDepthPacking) {
    this.depthMaskPass.fullscreenMaterial.depthBuffer0 = depthTexture;
    this.depthMaskPass.fullscreenMaterial.depthPacking0 = depthPacking;
  }
  /**
   * Updates this effect.
   *
   * @param {WebGLRenderer} renderer - The renderer.
   * @param {WebGLRenderTarget} inputBuffer - A frame buffer that contains the result of the previous pass.
   * @param {Number} [deltaTime] - The time between the last frame and the current one in seconds.
   */
  update(renderer, inputBuffer, deltaTime) {
    const lightSource = this.lightSource;
    const parent = lightSource.parent;
    const matrixAutoUpdate = lightSource.matrixAutoUpdate;
    const renderTargetA = this.renderTargetA;
    const renderTargetLight = this.renderTargetLight;
    lightSource.material.depthWrite = true;
    lightSource.matrixAutoUpdate = false;
    lightSource.updateWorldMatrix(true, false);
    if (parent !== null) {
      if (!matrixAutoUpdate) {
        m.copy(lightSource.matrix);
      }
      lightSource.matrix.copy(lightSource.matrixWorld);
    }
    this.lightScene.add(lightSource);
    this.renderPassLight.render(renderer, renderTargetLight);
    this.clearPass.render(renderer, renderTargetA);
    this.depthMaskPass.render(renderer, renderTargetLight, renderTargetA);
    lightSource.material.depthWrite = false;
    lightSource.matrixAutoUpdate = matrixAutoUpdate;
    if (parent !== null) {
      if (!matrixAutoUpdate) {
        lightSource.matrix.copy(m);
      }
      parent.add(lightSource);
    }
    v.setFromMatrixPosition(lightSource.matrixWorld).project(this.camera);
    this.screenPosition.set(
      Math.min(Math.max((v.x + 1) * 0.5, -1), 2),
      Math.min(Math.max((v.y + 1) * 0.5, -1), 2)
    );
    if (this.blurPass.enabled) {
      this.blurPass.render(renderer, renderTargetA, renderTargetA);
    }
    this.godRaysPass.render(renderer, renderTargetA, this.renderTargetB);
  }
  /**
   * Updates the size of internal render targets.
   *
   * @param {Number} width - The width.
   * @param {Number} height - The height.
   */
  setSize(width, height) {
    const resolution = this.resolution;
    resolution.setBaseSize(width, height);
    const w2 = resolution.width, h = resolution.height;
    this.renderTargetA.setSize(w2, h);
    this.renderTargetB.setSize(w2, h);
    this.renderTargetLight.setSize(w2, h);
    this.blurPass.resolution.copy(resolution);
  }
  /**
   * Performs initialization tasks.
   *
   * @param {WebGLRenderer} renderer - The renderer.
   * @param {Boolean} alpha - Whether the renderer uses the alpha channel or not.
   * @param {Number} frameBufferType - The type of the main frame buffers.
   */
  initialize(renderer, alpha, frameBufferType) {
    this.blurPass.initialize(renderer, alpha, frameBufferType);
    this.renderPassLight.initialize(renderer, alpha, frameBufferType);
    this.depthMaskPass.initialize(renderer, alpha, frameBufferType);
    this.godRaysPass.initialize(renderer, alpha, frameBufferType);
    if (frameBufferType !== void 0) {
      this.renderTargetA.texture.type = frameBufferType;
      this.renderTargetB.texture.type = frameBufferType;
      this.renderTargetLight.texture.type = frameBufferType;
      if (renderer !== null && renderer.outputColorSpace === SRGBColorSpace) {
        this.renderTargetA.texture.colorSpace = SRGBColorSpace;
        this.renderTargetB.texture.colorSpace = SRGBColorSpace;
        this.renderTargetLight.texture.colorSpace = SRGBColorSpace;
      }
    }
  }
};
var grid_default = `uniform vec2 scale;uniform float lineWidth;void mainImage(const in vec4 inputColor,const in vec2 uv,out vec4 outputColor){float grid=0.5-max(abs(mod(uv.x*scale.x,1.0)-0.5),abs(mod(uv.y*scale.y,1.0)-0.5));outputColor=vec4(vec3(smoothstep(0.0,lineWidth,grid)),inputColor.a);}`;
var GridEffect = class extends Effect {
  /**
   * Constructs a new grid effect.
   *
   * @param {Object} [options] - The options.
   * @param {BlendFunction} [options.blendFunction=BlendFunction.OVERLAY] - The blend function of this effect.
   * @param {Number} [options.scale=1.0] - The scale of the grid pattern.
   * @param {Number} [options.lineWidth=0.0] - The line width of the grid pattern.
   */
  constructor({ blendFunction = BlendFunction.OVERLAY, scale: scale3 = 1, lineWidth = 0 } = {}) {
    super("GridEffect", grid_default, {
      blendFunction,
      uniforms: /* @__PURE__ */ new Map([
        ["scale", new Uniform(new Vector2())],
        ["lineWidth", new Uniform(lineWidth)]
      ])
    });
    this.resolution = new Vector2();
    this.s = 0;
    this.scale = scale3;
    this.l = 0;
    this.lineWidth = lineWidth;
  }
  /**
   * The scale.
   *
   * @type {Number}
   */
  get scale() {
    return this.s;
  }
  set scale(value) {
    this.s = Math.max(value, 1e-6);
    this.setSize(this.resolution.width, this.resolution.height);
  }
  /**
   * Returns the current grid scale.
   *
   * @deprecated Use scale instead.
   * @return {Number} The grid scale.
   */
  getScale() {
    return this.scale;
  }
  /**
   * Sets the grid scale.
   *
   * @deprecated Use scale instead.
   * @param {Number} value - The new grid scale.
   */
  setScale(value) {
    this.scale = value;
  }
  /**
   * The line width.
   *
   * @type {Number}
   */
  get lineWidth() {
    return this.l;
  }
  set lineWidth(value) {
    this.l = value;
    this.setSize(this.resolution.width, this.resolution.height);
  }
  /**
   * Returns the current grid line width.
   *
   * @deprecated Use lineWidth instead.
   * @return {Number} The grid line width.
   */
  getLineWidth() {
    return this.lineWidth;
  }
  /**
   * Sets the grid line width.
   *
   * @deprecated Use lineWidth instead.
   * @param {Number} value - The new grid line width.
   */
  setLineWidth(value) {
    this.lineWidth = value;
  }
  /**
   * Updates the size of this pass.
   *
   * @param {Number} width - The width.
   * @param {Number} height - The height.
   */
  setSize(width, height) {
    this.resolution.set(width, height);
    const aspect = width / height;
    const scale3 = this.scale * (height * 0.125);
    this.uniforms.get("scale").value.set(aspect * scale3, scale3);
    this.uniforms.get("lineWidth").value = scale3 / height + this.lineWidth;
  }
};
var hue_saturation_default = `uniform vec3 hue;uniform float saturation;void mainImage(const in vec4 inputColor,const in vec2 uv,out vec4 outputColor){vec3 color=vec3(dot(inputColor.rgb,hue.xyz),dot(inputColor.rgb,hue.zxy),dot(inputColor.rgb,hue.yzx));float average=(color.r+color.g+color.b)/3.0;vec3 diff=average-color;if(saturation>0.0){color+=diff*(1.0-1.0/(1.001-saturation));}else{color+=diff*-saturation;}outputColor=vec4(min(color,1.0),inputColor.a);}`;
var HueSaturationEffect = class extends Effect {
  /**
   * Constructs a new hue/saturation effect.
   *
   * @param {Object} [options] - The options.
   * @param {BlendFunction} [options.blendFunction=BlendFunction.SRC] - The blend function of this effect.
   * @param {Number} [options.hue=0.0] - The hue in radians.
   * @param {Number} [options.saturation=0.0] - The saturation factor, ranging from -1 to 1, where 0 means no change.
   */
  constructor({ blendFunction = BlendFunction.SRC, hue = 0, saturation = 0 } = {}) {
    super("HueSaturationEffect", hue_saturation_default, {
      blendFunction,
      uniforms: /* @__PURE__ */ new Map([
        ["hue", new Uniform(new Vector3())],
        ["saturation", new Uniform(saturation)]
      ])
    });
    this.hue = hue;
  }
  /**
   * The saturation.
   *
   * @type {Number}
   */
  get saturation() {
    return this.uniforms.get("saturation").value;
  }
  set saturation(value) {
    this.uniforms.get("saturation").value = value;
  }
  /**
   * Returns the saturation.
   *
   * @deprecated Use saturation instead.
   * @return {Number} The saturation.
   */
  getSaturation() {
    return this.saturation;
  }
  /**
   * Sets the saturation.
   *
   * @deprecated Use saturation instead.
   * @param {Number} value - The saturation.
   */
  setSaturation(value) {
    this.saturation = value;
  }
  /**
   * The hue.
   *
   * @type {Number}
   */
  get hue() {
    const hue = this.uniforms.get("hue").value;
    return Math.acos((hue.x * 3 - 1) / 2);
  }
  set hue(value) {
    const s = Math.sin(value), c2 = Math.cos(value);
    this.uniforms.get("hue").value.set(
      (2 * c2 + 1) / 3,
      (-Math.sqrt(3) * s - c2 + 1) / 3,
      (Math.sqrt(3) * s - c2 + 1) / 3
    );
  }
  /**
   * Returns the hue.
   *
   * @deprecated Use hue instead.
   * @return {Number} The hue in radians.
   */
  getHue() {
    return this.hue;
  }
  /**
   * Sets the hue.
   *
   * @deprecated Use hue instead.
   * @param {Number} value - The hue in radians.
   */
  setHue(value) {
    this.hue = value;
  }
};
var LUTOperation = {
  SCALE_UP: "lut.scaleup"
};
function createCanvas(width, height, data) {
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  canvas.width = width;
  canvas.height = height;
  if (data instanceof Image) {
    context.drawImage(data, 0, 0);
  } else {
    const imageData = context.createImageData(width, height);
    imageData.data.set(data);
    context.putImageData(imageData, 0, 0);
  }
  return canvas;
}
var RawImageData = class _RawImageData {
  /**
   * Constructs a new image data container.
   *
   * @param {Number} [width=0] - The width of the image.
   * @param {Number} [height=0] - The height of the image.
   * @param {Uint8ClampedArray} [data=null] - The image data.
   */
  constructor(width = 0, height = 0, data = null) {
    this.width = width;
    this.height = height;
    this.data = data;
  }
  /**
   * Creates a canvas from this image data.
   *
   * @return {Canvas} The canvas, or null if it couldn't be created.
   */
  toCanvas() {
    return typeof document === "undefined" ? null : createCanvas(this.width, this.height, this.data);
  }
  /**
   * Creates a new image data container.
   *
   * @param {ImageData|Image} image - An image or plain image data.
   * @return {RawImageData} The image data.
   */
  static from(image) {
    const { width, height } = image;
    let data;
    if (image instanceof Image) {
      const canvas = createCanvas(width, height, image);
      if (canvas !== null) {
        const context = canvas.getContext("2d");
        data = context.getImageData(0, 0, width, height).data;
      }
    } else {
      data = image.data;
    }
    return new _RawImageData(width, height, data);
  }
};
var worker_default = '"use strict";(()=>{var O={SCALE_UP:"lut.scaleup"};var _=[new Float32Array(3),new Float32Array(3)],n=[new Float32Array(3),new Float32Array(3),new Float32Array(3),new Float32Array(3)],Z=[[new Float32Array([0,0,0]),new Float32Array([1,0,0]),new Float32Array([1,1,0]),new Float32Array([1,1,1])],[new Float32Array([0,0,0]),new Float32Array([1,0,0]),new Float32Array([1,0,1]),new Float32Array([1,1,1])],[new Float32Array([0,0,0]),new Float32Array([0,0,1]),new Float32Array([1,0,1]),new Float32Array([1,1,1])],[new Float32Array([0,0,0]),new Float32Array([0,1,0]),new Float32Array([1,1,0]),new Float32Array([1,1,1])],[new Float32Array([0,0,0]),new Float32Array([0,1,0]),new Float32Array([0,1,1]),new Float32Array([1,1,1])],[new Float32Array([0,0,0]),new Float32Array([0,0,1]),new Float32Array([0,1,1]),new Float32Array([1,1,1])]];function d(a,t,r,m){let i=r[0]-t[0],e=r[1]-t[1],y=r[2]-t[2],h=a[0]-t[0],A=a[1]-t[1],w=a[2]-t[2],c=e*w-y*A,l=y*h-i*w,x=i*A-e*h,u=Math.sqrt(c*c+l*l+x*x),b=u*.5,s=c/u,F=l/u,f=x/u,p=-(a[0]*s+a[1]*F+a[2]*f),M=m[0]*s+m[1]*F+m[2]*f;return Math.abs(M+p)*b/3}function V(a,t,r,m,i,e){let y=(r+m*t+i*t*t)*4;e[0]=a[y+0],e[1]=a[y+1],e[2]=a[y+2]}function k(a,t,r,m,i,e){let y=r*(t-1),h=m*(t-1),A=i*(t-1),w=Math.floor(y),c=Math.floor(h),l=Math.floor(A),x=Math.ceil(y),u=Math.ceil(h),b=Math.ceil(A),s=y-w,F=h-c,f=A-l;if(w===y&&c===h&&l===A)V(a,t,y,h,A,e);else{let p;s>=F&&F>=f?p=Z[0]:s>=f&&f>=F?p=Z[1]:f>=s&&s>=F?p=Z[2]:F>=s&&s>=f?p=Z[3]:F>=f&&f>=s?p=Z[4]:f>=F&&F>=s&&(p=Z[5]);let[M,g,X,Y]=p,P=_[0];P[0]=s,P[1]=F,P[2]=f;let o=_[1],L=x-w,S=u-c,U=b-l;o[0]=L*M[0]+w,o[1]=S*M[1]+c,o[2]=U*M[2]+l,V(a,t,o[0],o[1],o[2],n[0]),o[0]=L*g[0]+w,o[1]=S*g[1]+c,o[2]=U*g[2]+l,V(a,t,o[0],o[1],o[2],n[1]),o[0]=L*X[0]+w,o[1]=S*X[1]+c,o[2]=U*X[2]+l,V(a,t,o[0],o[1],o[2],n[2]),o[0]=L*Y[0]+w,o[1]=S*Y[1]+c,o[2]=U*Y[2]+l,V(a,t,o[0],o[1],o[2],n[3]);let T=d(g,X,Y,P)*6,q=d(M,X,Y,P)*6,C=d(M,g,Y,P)*6,E=d(M,g,X,P)*6;n[0][0]*=T,n[0][1]*=T,n[0][2]*=T,n[1][0]*=q,n[1][1]*=q,n[1][2]*=q,n[2][0]*=C,n[2][1]*=C,n[2][2]*=C,n[3][0]*=E,n[3][1]*=E,n[3][2]*=E,e[0]=n[0][0]+n[1][0]+n[2][0]+n[3][0],e[1]=n[0][1]+n[1][1]+n[2][1]+n[3][1],e[2]=n[0][2]+n[1][2]+n[2][2]+n[3][2]}}var v=class{static expand(t,r){let m=Math.cbrt(t.length/4),i=new Float32Array(3),e=new t.constructor(r**3*4),y=t instanceof Uint8Array?255:1,h=r**2,A=1/(r-1);for(let w=0;w<r;++w)for(let c=0;c<r;++c)for(let l=0;l<r;++l){let x=l*A,u=c*A,b=w*A,s=Math.round(l+c*r+w*h)*4;k(t,m,x,u,b,i),e[s+0]=i[0],e[s+1]=i[1],e[s+2]=i[2],e[s+3]=y}return e}};self.addEventListener("message",a=>{let t=a.data,r=t.data;switch(t.operation){case O.SCALE_UP:r=v.expand(r,t.size);break}postMessage(r,[r.buffer]),close()});})();\n';
var c = new Color();
var LookupTexture = class _LookupTexture extends Data3DTexture {
  /**
   * Constructs a cubic 3D lookup texture.
   *
   * @param {TypedArray} data - The pixel data. The default format is RGBA.
   * @param {Number} size - The sidelength.
   */
  constructor(data, size) {
    super(data, size, size, size);
    this.type = FloatType;
    this.format = RGBAFormat;
    this.minFilter = LinearFilter;
    this.magFilter = LinearFilter;
    this.wrapS = ClampToEdgeWrapping;
    this.wrapT = ClampToEdgeWrapping;
    this.wrapR = ClampToEdgeWrapping;
    this.unpackAlignment = 1;
    this.needsUpdate = true;
    this.colorSpace = LinearSRGBColorSpace;
    this.domainMin = new Vector3(0, 0, 0);
    this.domainMax = new Vector3(1, 1, 1);
  }
  /**
   * Indicates that this is an instance of LookupTexture3D.
   *
   * @type {Boolean}
   * @deprecated
   */
  get isLookupTexture3D() {
    return true;
  }
  /**
   * Scales this LUT up to a given target size using tetrahedral interpolation.
   *
   * @param {Number} size - The target sidelength.
   * @param {Boolean} [transferData=true] - Extra fast mode. Set to false to keep the original data intact.
   * @return {Promise<LookupTexture>} A promise that resolves with a new LUT upon completion.
   */
  scaleUp(size, transferData = true) {
    const image = this.image;
    let promise;
    if (size <= image.width) {
      promise = Promise.reject(new Error("The target size must be greater than the current size"));
    } else {
      promise = new Promise((resolve, reject) => {
        const workerURL = URL.createObjectURL(new Blob([worker_default], {
          type: "text/javascript"
        }));
        const worker = new Worker(workerURL);
        worker.addEventListener("error", (event) => reject(event.error));
        worker.addEventListener("message", (event) => {
          const lut = new _LookupTexture(event.data, size);
          this.colorSpace = lut.colorSpace;
          lut.type = this.type;
          lut.name = this.name;
          URL.revokeObjectURL(workerURL);
          resolve(lut);
        });
        const transferList = transferData ? [image.data.buffer] : [];
        worker.postMessage({
          operation: LUTOperation.SCALE_UP,
          data: image.data,
          size
        }, transferList);
      });
    }
    return promise;
  }
  /**
   * Applies the given LUT to this one.
   *
   * @param {LookupTexture} lut - A LUT. Must have the same dimensions, type and format as this LUT.
   * @return {LookupTexture} This texture.
   */
  applyLUT(lut) {
    const img0 = this.image;
    const img1 = lut.image;
    const size0 = Math.min(img0.width, img0.height, img0.depth);
    const size1 = Math.min(img1.width, img1.height, img1.depth);
    if (size0 !== size1) {
      console.error("Size mismatch");
    } else if (lut.type !== FloatType || this.type !== FloatType) {
      console.error("Both LUTs must be FloatType textures");
    } else if (lut.format !== RGBAFormat || this.format !== RGBAFormat) {
      console.error("Both LUTs must be RGBA textures");
    } else {
      const data0 = img0.data;
      const data1 = img1.data;
      const size = size0;
      const sizeSq = size ** 2;
      const s = size - 1;
      for (let i = 0, l = size ** 3; i < l; ++i) {
        const i4 = i * 4;
        const r = data0[i4 + 0] * s;
        const g = data0[i4 + 1] * s;
        const b = data0[i4 + 2] * s;
        const iRGB = Math.round(r + g * size + b * sizeSq) * 4;
        data0[i4 + 0] = data1[iRGB + 0];
        data0[i4 + 1] = data1[iRGB + 1];
        data0[i4 + 2] = data1[iRGB + 2];
      }
      this.needsUpdate = true;
    }
    return this;
  }
  /**
   * Converts the LUT data into unsigned byte data.
   *
   * This is a lossy operation which should only be performed after all other transformations have been applied.
   *
   * @return {LookupTexture} This texture.
   */
  convertToUint8() {
    if (this.type === FloatType) {
      const floatData = this.image.data;
      const uint8Data = new Uint8Array(floatData.length);
      for (let i = 0, l = floatData.length; i < l; ++i) {
        uint8Data[i] = floatData[i] * 255 + 0.5;
      }
      this.image.data = uint8Data;
      this.type = UnsignedByteType;
      this.needsUpdate = true;
    }
    return this;
  }
  /**
   * Converts the LUT data into float data.
   *
   * @return {LookupTexture} This texture.
   */
  convertToFloat() {
    if (this.type === UnsignedByteType) {
      const uint8Data = this.image.data;
      const floatData = new Float32Array(uint8Data.length);
      for (let i = 0, l = uint8Data.length; i < l; ++i) {
        floatData[i] = uint8Data[i] / 255;
      }
      this.image.data = floatData;
      this.type = FloatType;
      this.needsUpdate = true;
    }
    return this;
  }
  /**
   * Converts this LUT into RGBA data.
   *
   * @deprecated LUTs are RGBA by default since three r137.
   * @return {LookupTexture} This texture.
   */
  convertToRGBA() {
    console.warn("LookupTexture", "convertToRGBA() is deprecated, LUTs are now RGBA by default");
    return this;
  }
  /**
   * Converts the output of this LUT into sRGB color space.
   *
   * @return {LookupTexture} This texture.
   */
  convertLinearToSRGB() {
    const data = this.image.data;
    if (this.type === FloatType) {
      for (let i = 0, l = data.length; i < l; i += 4) {
        c.fromArray(data, i).convertLinearToSRGB().toArray(data, i);
      }
      this.colorSpace = SRGBColorSpace;
      this.needsUpdate = true;
    } else {
      console.error("Color space conversion requires FloatType data");
    }
    return this;
  }
  /**
   * Converts the output of this LUT into linear color space.
   *
   * @return {LookupTexture} This texture.
   */
  convertSRGBToLinear() {
    const data = this.image.data;
    if (this.type === FloatType) {
      for (let i = 0, l = data.length; i < l; i += 4) {
        c.fromArray(data, i).convertSRGBToLinear().toArray(data, i);
      }
      this.colorSpace = LinearSRGBColorSpace;
      this.needsUpdate = true;
    } else {
      console.error("Color space conversion requires FloatType data");
    }
    return this;
  }
  /**
   * Converts this LUT into a 2D data texture.
   *
   * Please note that custom input domains are not carried over to 2D textures.
   *
   * @return {DataTexture} The texture.
   */
  toDataTexture() {
    const width = this.image.width;
    const height = this.image.height * this.image.depth;
    const texture = new DataTexture(this.image.data, width, height);
    texture.name = this.name;
    texture.type = this.type;
    texture.format = this.format;
    texture.minFilter = LinearFilter;
    texture.magFilter = LinearFilter;
    texture.wrapS = this.wrapS;
    texture.wrapT = this.wrapT;
    texture.generateMipmaps = false;
    texture.needsUpdate = true;
    this.colorSpace = texture.colorSpace;
    return texture;
  }
  /**
   * Creates a new 3D LUT by copying a given LUT.
   *
   * Common image-based textures will be converted into 3D data textures.
   *
   * @param {Texture} texture - The LUT. Assumed to be cubic.
   * @return {LookupTexture} A new 3D LUT.
   */
  static from(texture) {
    const image = texture.image;
    const { width, height } = image;
    const size = Math.min(width, height);
    let data;
    if (image instanceof Image) {
      const rawImageData = RawImageData.from(image);
      const src = rawImageData.data;
      if (width > height) {
        data = new Uint8Array(src.length);
        for (let z2 = 0; z2 < size; ++z2) {
          for (let y = 0; y < size; ++y) {
            for (let x = 0; x < size; ++x) {
              const i4 = (x + z2 * size + y * size * size) * 4;
              const j4 = (x + y * size + z2 * size * size) * 4;
              data[j4 + 0] = src[i4 + 0];
              data[j4 + 1] = src[i4 + 1];
              data[j4 + 2] = src[i4 + 2];
              data[j4 + 3] = src[i4 + 3];
            }
          }
        }
      } else {
        data = new Uint8Array(src.buffer);
      }
    } else {
      data = image.data.slice();
    }
    const lut = new _LookupTexture(data, size);
    lut.type = texture.type;
    lut.name = texture.name;
    texture.colorSpace = lut.colorSpace;
    return lut;
  }
  /**
   * Creates a neutral 3D LUT.
   *
   * @param {Number} size - The sidelength.
   * @return {LookupTexture} A neutral 3D LUT.
   */
  static createNeutral(size) {
    const data = new Float32Array(size ** 3 * 4);
    const sizeSq = size ** 2;
    const s = 1 / (size - 1);
    for (let r = 0; r < size; ++r) {
      for (let g = 0; g < size; ++g) {
        for (let b = 0; b < size; ++b) {
          const i4 = (r + g * size + b * sizeSq) * 4;
          data[i4 + 0] = r * s;
          data[i4 + 1] = g * s;
          data[i4 + 2] = b * s;
          data[i4 + 3] = 1;
        }
      }
    }
    const lut = new _LookupTexture(data, size);
    lut.name = "neutral";
    return lut;
  }
};
var lut_3d_default = `uniform vec3 scale;uniform vec3 offset;
#ifdef CUSTOM_INPUT_DOMAIN
uniform vec3 domainMin;uniform vec3 domainMax;
#endif
#ifdef LUT_3D
#ifdef LUT_PRECISION_HIGH
#ifdef GL_FRAGMENT_PRECISION_HIGH
uniform highp sampler3D lut;
#else
uniform mediump sampler3D lut;
#endif
#else
uniform lowp sampler3D lut;
#endif
vec4 applyLUT(const in vec3 rgb){
#ifdef TETRAHEDRAL_INTERPOLATION
vec3 p=floor(rgb);vec3 f=rgb-p;vec3 v1=(p+0.5)*LUT_TEXEL_WIDTH;vec3 v4=(p+1.5)*LUT_TEXEL_WIDTH;vec3 v2,v3;vec3 frac;if(f.r>=f.g){if(f.g>f.b){frac=f.rgb;v2=vec3(v4.x,v1.y,v1.z);v3=vec3(v4.x,v4.y,v1.z);}else if(f.r>=f.b){frac=f.rbg;v2=vec3(v4.x,v1.y,v1.z);v3=vec3(v4.x,v1.y,v4.z);}else{frac=f.brg;v2=vec3(v1.x,v1.y,v4.z);v3=vec3(v4.x,v1.y,v4.z);}}else{if(f.b>f.g){frac=f.bgr;v2=vec3(v1.x,v1.y,v4.z);v3=vec3(v1.x,v4.y,v4.z);}else if(f.r>=f.b){frac=f.grb;v2=vec3(v1.x,v4.y,v1.z);v3=vec3(v4.x,v4.y,v1.z);}else{frac=f.gbr;v2=vec3(v1.x,v4.y,v1.z);v3=vec3(v1.x,v4.y,v4.z);}}vec4 n1=texture(lut,v1);vec4 n2=texture(lut,v2);vec4 n3=texture(lut,v3);vec4 n4=texture(lut,v4);vec4 weights=vec4(1.0-frac.x,frac.x-frac.y,frac.y-frac.z,frac.z);vec4 result=weights*mat4(vec4(n1.r,n2.r,n3.r,n4.r),vec4(n1.g,n2.g,n3.g,n4.g),vec4(n1.b,n2.b,n3.b,n4.b),vec4(1.0));return vec4(result.rgb,1.0);
#else
return texture(lut,rgb);
#endif
}
#else
#ifdef LUT_PRECISION_HIGH
#ifdef GL_FRAGMENT_PRECISION_HIGH
uniform highp sampler2D lut;
#else
uniform mediump sampler2D lut;
#endif
#else
uniform lowp sampler2D lut;
#endif
vec4 applyLUT(const in vec3 rgb){float slice=rgb.b*LUT_SIZE;float slice0=floor(slice);float interp=slice-slice0;float centeredInterp=interp-0.5;float slice1=slice0+sign(centeredInterp);
#ifdef LUT_STRIP_HORIZONTAL
float xOffset=clamp(rgb.r*LUT_TEXEL_HEIGHT,LUT_TEXEL_WIDTH*0.5,LUT_TEXEL_HEIGHT-LUT_TEXEL_WIDTH*0.5);vec2 uv0=vec2(slice0*LUT_TEXEL_HEIGHT+xOffset,rgb.g);vec2 uv1=vec2(slice1*LUT_TEXEL_HEIGHT+xOffset,rgb.g);
#else
float yOffset=clamp(rgb.g*LUT_TEXEL_WIDTH,LUT_TEXEL_HEIGHT*0.5,LUT_TEXEL_WIDTH-LUT_TEXEL_HEIGHT*0.5);vec2 uv0=vec2(rgb.r,slice0*LUT_TEXEL_WIDTH+yOffset);vec2 uv1=vec2(rgb.r,slice1*LUT_TEXEL_WIDTH+yOffset);
#endif
vec4 sample0=texture2D(lut,uv0);vec4 sample1=texture2D(lut,uv1);return mix(sample0,sample1,abs(centeredInterp));}
#endif
void mainImage(const in vec4 inputColor,const in vec2 uv,out vec4 outputColor){vec3 c=inputColor.rgb;
#ifdef CUSTOM_INPUT_DOMAIN
if(c.r>=domainMin.r&&c.g>=domainMin.g&&c.b>=domainMin.b&&c.r<=domainMax.r&&c.g<=domainMax.g&&c.b<=domainMax.b){c=applyLUT(scale*c+offset).rgb;}else{c=inputColor.rgb;}
#else
#if !defined(LUT_3D) || defined(TETRAHEDRAL_INTERPOLATION)
c=clamp(c,0.0,1.0);
#endif
c=applyLUT(scale*c+offset).rgb;
#endif
outputColor=vec4(c,inputColor.a);}`;
var LUT3DEffect = class extends Effect {
  /**
   * Constructs a new color grading effect.
   *
   * @param {Texture} lut - The lookup texture.
   * @param {Object} [options] - The options.
   * @param {BlendFunction} [options.blendFunction=BlendFunction.SRC] - The blend function of this effect.
   * @param {Boolean} [options.tetrahedralInterpolation=false] - Enables or disables tetrahedral interpolation.
   * @param {ColorSpace} [options.inputColorSpace=SRGBColorSpace] - The input color space.
   */
  constructor(lut, {
    blendFunction = BlendFunction.SRC,
    tetrahedralInterpolation = false,
    inputColorSpace = SRGBColorSpace
  } = {}) {
    super("LUT3DEffect", lut_3d_default, {
      blendFunction,
      uniforms: /* @__PURE__ */ new Map([
        ["lut", new Uniform(null)],
        ["scale", new Uniform(new Vector3())],
        ["offset", new Uniform(new Vector3())],
        ["domainMin", new Uniform(null)],
        ["domainMax", new Uniform(null)]
      ])
    });
    this.tetrahedralInterpolation = tetrahedralInterpolation;
    this.inputColorSpace = inputColorSpace;
    this.lut = lut;
  }
  /**
   * The LUT.
   *
   * @type {Texture}
   */
  get lut() {
    return this.uniforms.get("lut").value;
  }
  set lut(value) {
    const defines = this.defines;
    const uniforms = this.uniforms;
    if (this.lut !== value) {
      uniforms.get("lut").value = value;
      if (value !== null) {
        const image = value.image;
        const tetrahedralInterpolation = this.tetrahedralInterpolation;
        defines.clear();
        defines.set("LUT_SIZE", Math.min(image.width, image.height).toFixed(16));
        defines.set("LUT_TEXEL_WIDTH", (1 / image.width).toFixed(16));
        defines.set("LUT_TEXEL_HEIGHT", (1 / image.height).toFixed(16));
        uniforms.get("domainMin").value = null;
        uniforms.get("domainMax").value = null;
        if (value.type === FloatType || value.type === HalfFloatType) {
          defines.set("LUT_PRECISION_HIGH", "1");
        }
        if (image.width > image.height) {
          defines.set("LUT_STRIP_HORIZONTAL", "1");
        } else if (value instanceof Data3DTexture) {
          defines.set("LUT_3D", "1");
        }
        if (value instanceof LookupTexture) {
          const min = value.domainMin;
          const max = value.domainMax;
          if (min.x !== 0 || min.y !== 0 || min.z !== 0 || max.x !== 1 || max.y !== 1 || max.z !== 1) {
            defines.set("CUSTOM_INPUT_DOMAIN", "1");
            uniforms.get("domainMin").value = min.clone();
            uniforms.get("domainMax").value = max.clone();
          }
        }
        this.tetrahedralInterpolation = tetrahedralInterpolation;
      }
    }
  }
  /**
   * Returns the current LUT.
   *
   * @deprecated Use lut instead.
   * @return {Texture} The LUT.
   */
  getLUT() {
    return this.lut;
  }
  /**
   * Sets the LUT.
   *
   * @deprecated Use lut instead.
   * @param {Texture} value - The LUT.
   */
  setLUT(value) {
    this.lut = value;
  }
  /**
   * Updates the scale and offset for the LUT sampling coordinates.
   *
   * @private
   */
  updateScaleOffset() {
    const lut = this.lut;
    if (lut !== null) {
      const size = Math.min(lut.image.width, lut.image.height);
      const scale3 = this.uniforms.get("scale").value;
      const offset = this.uniforms.get("offset").value;
      if (this.tetrahedralInterpolation && lut instanceof Data3DTexture) {
        if (this.defines.has("CUSTOM_INPUT_DOMAIN")) {
          const domainScale = lut.domainMax.clone().sub(lut.domainMin);
          scale3.setScalar(size - 1).divide(domainScale);
          offset.copy(lut.domainMin).negate().multiply(scale3);
        } else {
          scale3.setScalar(size - 1);
          offset.setScalar(0);
        }
      } else {
        if (this.defines.has("CUSTOM_INPUT_DOMAIN")) {
          const domainScale = lut.domainMax.clone().sub(lut.domainMin).multiplyScalar(size);
          scale3.setScalar(size - 1).divide(domainScale);
          offset.copy(lut.domainMin).negate().multiply(scale3).addScalar(1 / (2 * size));
        } else {
          scale3.setScalar((size - 1) / size);
          offset.setScalar(1 / (2 * size));
        }
      }
    }
  }
  /**
   * Configures parameters for tetrahedral interpolation.
   *
   * @private
   */
  configureTetrahedralInterpolation() {
    const lut = this.lut;
    if (lut !== null) {
      lut.minFilter = LinearFilter;
      lut.magFilter = LinearFilter;
      if (this.tetrahedralInterpolation) {
        if (lut instanceof Data3DTexture) {
          lut.minFilter = NearestFilter;
          lut.magFilter = NearestFilter;
        } else {
          console.warn("Tetrahedral interpolation requires a 3D texture");
        }
      }
      lut.needsUpdate = true;
    }
  }
  /**
   * Indicates whether tetrahedral interpolation is enabled. Requires a 3D LUT, disabled by default.
   *
   * Tetrahedral interpolation produces highly accurate results but is slower than hardware interpolation.
   *
   * @type {Boolean}
   */
  get tetrahedralInterpolation() {
    return this.defines.has("TETRAHEDRAL_INTERPOLATION");
  }
  set tetrahedralInterpolation(value) {
    if (value) {
      this.defines.set("TETRAHEDRAL_INTERPOLATION", "1");
    } else {
      this.defines.delete("TETRAHEDRAL_INTERPOLATION");
    }
    this.configureTetrahedralInterpolation();
    this.updateScaleOffset();
    this.setChanged();
  }
  /**
   * Enables or disables tetrahedral interpolation.
   *
   * @deprecated Use tetrahedralInterpolation instead.
   * @param {Boolean} value - Whether tetrahedral interpolation should be enabled.
   */
  setTetrahedralInterpolationEnabled(value) {
    this.tetrahedralInterpolation = value;
  }
};
var DepthCopyMode = {
  FULL: 0,
  SINGLE: 1
};
var EdgeDetectionMode = {
  DEPTH: 0,
  LUMA: 1,
  COLOR: 2
};
var PredicationMode = {
  DISABLED: 0,
  DEPTH: 1,
  CUSTOM: 2
};
var SMAAPreset = {
  LOW: 0,
  MEDIUM: 1,
  HIGH: 2,
  ULTRA: 3
};
var ToneMappingMode = {
  LINEAR: 0,
  REINHARD: 1,
  REINHARD2: 2,
  REINHARD2_ADAPTIVE: 3,
  UNCHARTED2: 4,
  OPTIMIZED_CINEON: 5,
  CINEON: 5,
  ACES_FILMIC: 6,
  AGX: 7,
  NEUTRAL: 8
};
var VignetteTechnique = {
  DEFAULT: 0,
  ESKIL: 1
};
var noise_default = `void mainImage(const in vec4 inputColor,const in vec2 uv,out vec4 outputColor){vec3 noise=vec3(rand(uv*(1.0+time)));
#ifdef PREMULTIPLY
outputColor=vec4(min(inputColor.rgb*noise,vec3(1.0)),inputColor.a);
#else
outputColor=vec4(noise,inputColor.a);
#endif
}`;
var NoiseEffect = class extends Effect {
  /**
   * Constructs a new noise effect.
   *
   * @param {Object} [options] - The options.
   * @param {BlendFunction} [options.blendFunction=BlendFunction.SCREEN] - The blend function of this effect.
   * @param {Boolean} [options.premultiply=false] - Whether the noise should be multiplied with the input colors prior to blending.
   */
  constructor({ blendFunction = BlendFunction.SCREEN, premultiply = false } = {}) {
    super("NoiseEffect", noise_default, { blendFunction });
    this.premultiply = premultiply;
  }
  /**
   * Indicates whether noise will be multiplied with the input colors prior to blending.
   *
   * @type {Boolean}
   */
  get premultiply() {
    return this.defines.has("PREMULTIPLY");
  }
  set premultiply(value) {
    if (this.premultiply !== value) {
      if (value) {
        this.defines.set("PREMULTIPLY", "1");
      } else {
        this.defines.delete("PREMULTIPLY");
      }
      this.setChanged();
    }
  }
  /**
   * Indicates whether noise will be multiplied with the input colors prior to blending.
   *
   * @deprecated Use premultiply instead.
   * @return {Boolean} Whether noise is premultiplied.
   */
  isPremultiplied() {
    return this.premultiply;
  }
  /**
   * Controls whether noise should be multiplied with the input colors prior to blending.
   *
   * @deprecated Use premultiply instead.
   * @param {Boolean} value - Whether noise should be premultiplied.
   */
  setPremultiplied(value) {
    this.premultiply = value;
  }
};
var depth_comparison_default = `#include <packing>
#include <clipping_planes_pars_fragment>
#ifdef GL_FRAGMENT_PRECISION_HIGH
uniform highp sampler2D depthBuffer;
#else
uniform mediump sampler2D depthBuffer;
#endif
uniform float cameraNear;uniform float cameraFar;centroid varying float vViewZ;centroid varying vec4 vProjTexCoord;void main(){
#include <clipping_planes_fragment>
vec2 projTexCoord=(vProjTexCoord.xy/vProjTexCoord.w)*0.5+0.5;projTexCoord=clamp(projTexCoord,0.002,0.998);
#if DEPTH_PACKING == 3201
float fragCoordZ=unpackRGBAToDepth(texture2D(depthBuffer,projTexCoord));
#else
float fragCoordZ=texture2D(depthBuffer,projTexCoord).r;
#endif
#ifdef PERSPECTIVE_CAMERA
float viewZ=perspectiveDepthToViewZ(fragCoordZ,cameraNear,cameraFar);
#else
float viewZ=orthographicDepthToViewZ(fragCoordZ,cameraNear,cameraFar);
#endif
float depthTest=(-vViewZ>-viewZ)?1.0:0.0;gl_FragColor.rg=vec2(0.0,depthTest);}`;
var depth_comparison_default2 = `#include <common>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
varying float vViewZ;varying vec4 vProjTexCoord;void main(){
#include <skinbase_vertex>
#include <begin_vertex>
#include <morphtarget_vertex>
#include <skinning_vertex>
#include <project_vertex>
vViewZ=mvPosition.z;vProjTexCoord=gl_Position;
#include <clipping_planes_vertex>
}`;
var DepthComparisonMaterial = class extends ShaderMaterial {
  /**
   * Constructs a new depth comparison material.
   *
   * @param {Texture} [depthTexture=null] - A depth texture.
   * @param {PerspectiveCamera} [camera] - A camera.
   */
  constructor(depthTexture = null, camera) {
    super({
      name: "DepthComparisonMaterial",
      defines: {
        DEPTH_PACKING: "0"
      },
      uniforms: {
        depthBuffer: new Uniform(null),
        cameraNear: new Uniform(0.3),
        cameraFar: new Uniform(1e3)
      },
      blending: NoBlending,
      toneMapped: false,
      depthWrite: false,
      depthTest: false,
      fragmentShader: depth_comparison_default,
      vertexShader: depth_comparison_default2
    });
    this.depthBuffer = depthTexture;
    this.depthPacking = RGBADepthPacking;
    this.copyCameraSettings(camera);
  }
  /**
   * The depth buffer.
   *
   * @type {Texture}
   */
  set depthBuffer(value) {
    this.uniforms.depthBuffer.value = value;
  }
  /**
   * The depth packing strategy.
   *
   * @type {DepthPackingStrategies}
   */
  set depthPacking(value) {
    this.defines.DEPTH_PACKING = value.toFixed(0);
    this.needsUpdate = true;
  }
  /**
   * Sets the depth buffer.
   *
   * @deprecated Use depthBuffer and depthPacking instead.
   * @param {Texture} buffer - The depth texture.
   * @param {DepthPackingStrategies} [depthPacking=RGBADepthPacking] - The depth packing strategy.
   */
  setDepthBuffer(buffer2, depthPacking = RGBADepthPacking) {
    this.depthBuffer = buffer2;
    this.depthPacking = depthPacking;
  }
  /**
   * Copies the settings of the given camera.
   *
   * @deprecated Use copyCameraSettings instead.
   * @param {Camera} camera - A camera.
   */
  adoptCameraSettings(camera) {
    this.copyCameraSettings(camera);
  }
  /**
   * Copies the settings of the given camera.
   *
   * @param {Camera} camera - A camera.
   */
  copyCameraSettings(camera) {
    if (camera) {
      this.uniforms.cameraNear.value = camera.near;
      this.uniforms.cameraFar.value = camera.far;
      if (camera instanceof PerspectiveCamera) {
        this.defines.PERSPECTIVE_CAMERA = "1";
      } else {
        delete this.defines.PERSPECTIVE_CAMERA;
      }
      this.needsUpdate = true;
    }
  }
};
var outline_default = `uniform lowp sampler2D inputBuffer;varying vec2 vUv0;varying vec2 vUv1;varying vec2 vUv2;varying vec2 vUv3;void main(){vec2 c0=texture2D(inputBuffer,vUv0).rg;vec2 c1=texture2D(inputBuffer,vUv1).rg;vec2 c2=texture2D(inputBuffer,vUv2).rg;vec2 c3=texture2D(inputBuffer,vUv3).rg;float d0=(c0.x-c1.x)*0.5;float d1=(c2.x-c3.x)*0.5;float d=length(vec2(d0,d1));float a0=min(c0.y,c1.y);float a1=min(c2.y,c3.y);float visibilityFactor=min(a0,a1);gl_FragColor.rg=(1.0-visibilityFactor>0.001)?vec2(d,0.0):vec2(0.0,d);}`;
var outline_default2 = `uniform vec2 texelSize;varying vec2 vUv0;varying vec2 vUv1;varying vec2 vUv2;varying vec2 vUv3;void main(){vec2 uv=position.xy*0.5+0.5;vUv0=vec2(uv.x+texelSize.x,uv.y);vUv1=vec2(uv.x-texelSize.x,uv.y);vUv2=vec2(uv.x,uv.y+texelSize.y);vUv3=vec2(uv.x,uv.y-texelSize.y);gl_Position=vec4(position.xy,1.0,1.0);}`;
var OutlineMaterial = class extends ShaderMaterial {
  /**
   * Constructs a new outline material.
   *
   * TODO Remove texelSize param.
   * @param {Vector2} [texelSize] - The screen texel size.
   */
  constructor(texelSize = new Vector2()) {
    super({
      name: "OutlineMaterial",
      uniforms: {
        inputBuffer: new Uniform(null),
        texelSize: new Uniform(new Vector2())
      },
      blending: NoBlending,
      toneMapped: false,
      depthWrite: false,
      depthTest: false,
      fragmentShader: outline_default,
      vertexShader: outline_default2
    });
    this.uniforms.texelSize.value.set(texelSize.x, texelSize.y);
    this.uniforms.maskTexture = this.uniforms.inputBuffer;
  }
  /**
   * The input buffer.
   *
   * @type {Texture}
   */
  set inputBuffer(value) {
    this.uniforms.inputBuffer.value = value;
  }
  /**
   * Sets the input buffer.
   *
   * @deprecated Use inputBuffer instead.
   * @param {Texture} value - The input buffer.
   */
  setInputBuffer(value) {
    this.uniforms.inputBuffer.value = value;
  }
  /**
   * Sets the texel size.
   *
   * @deprecated Use setSize() instead.
   * @param {Number} x - The texel width.
   * @param {Number} y - The texel height.
   */
  setTexelSize(x, y) {
    this.uniforms.texelSize.value.set(x, y);
  }
  /**
   * Sets the size of this object.
   *
   * @param {Number} width - The width.
   * @param {Number} height - The height.
   */
  setSize(width, height) {
    this.uniforms.texelSize.value.set(1 / width, 1 / height);
  }
};
var DepthPass = class extends Pass {
  /**
   * Constructs a new depth pass.
   *
   * @param {Scene} scene - The scene to render.
   * @param {Camera} camera - The camera to use to render the scene.
   * @param {Object} [options] - The options.
   * @param {WebGLRenderTarget} [options.renderTarget] - A custom render target.
   * @param {Number} [options.resolutionScale=1.0] - The resolution scale.
   * @param {Number} [options.resolutionX=Resolution.AUTO_SIZE] - The horizontal resolution.
   * @param {Number} [options.resolutionY=Resolution.AUTO_SIZE] - The vertical resolution.
   * @param {Number} [options.width=Resolution.AUTO_SIZE] - Deprecated. Use resolutionX instead.
   * @param {Number} [options.height=Resolution.AUTO_SIZE] - Deprecated. Use resolutionY instead.
   */
  constructor(scene, camera, {
    renderTarget,
    resolutionScale = 1,
    width = Resolution.AUTO_SIZE,
    height = Resolution.AUTO_SIZE,
    resolutionX = width,
    resolutionY = height
  } = {}) {
    super("DepthPass");
    this.needsSwap = false;
    this.renderPass = new RenderPass(scene, camera, new MeshDepthMaterial({
      depthPacking: RGBADepthPacking
    }));
    const renderPass = this.renderPass;
    renderPass.skipShadowMapUpdate = true;
    renderPass.ignoreBackground = true;
    const clearPass = renderPass.clearPass;
    clearPass.overrideClearColor = new Color(16777215);
    clearPass.overrideClearAlpha = 1;
    this.renderTarget = renderTarget;
    if (this.renderTarget === void 0) {
      this.renderTarget = new WebGLRenderTarget(1, 1, {
        minFilter: NearestFilter,
        magFilter: NearestFilter
      });
      this.renderTarget.texture.name = "DepthPass.Target";
    }
    const resolution = this.resolution = new Resolution(this, resolutionX, resolutionY, resolutionScale);
    resolution.addEventListener("change", (e) => this.setSize(resolution.baseWidth, resolution.baseHeight));
  }
  set mainScene(value) {
    this.renderPass.mainScene = value;
  }
  set mainCamera(value) {
    this.renderPass.mainCamera = value;
  }
  /**
   * The depth texture.
   *
   * @type {Texture}
   */
  get texture() {
    return this.renderTarget.texture;
  }
  /**
   * Returns the depth texture.
   *
   * @deprecated Use texture instead.
   * @return {Texture} The texture.
   */
  getTexture() {
    return this.renderTarget.texture;
  }
  /**
   * Returns the resolution settings.
   *
   * @deprecated Use resolution instead.
   * @return {Resolution} The resolution.
   */
  getResolution() {
    return this.resolution;
  }
  /**
   * Returns the current resolution scale.
   *
   * @return {Number} The resolution scale.
   * @deprecated Use resolution instead.
   */
  getResolutionScale() {
    return this.resolution.scale;
  }
  /**
   * Sets the resolution scale.
   *
   * @param {Number} scale - The new resolution scale.
   * @deprecated Use resolution instead.
   */
  setResolutionScale(scale3) {
    this.resolution.scale = scale3;
  }
  /**
   * Renders the scene depth.
   *
   * @param {WebGLRenderer} renderer - The renderer.
   * @param {WebGLRenderTarget} inputBuffer - A frame buffer that contains the result of the previous pass.
   * @param {WebGLRenderTarget} outputBuffer - A frame buffer that serves as the output render target unless this pass renders to screen.
   * @param {Number} [deltaTime] - The time between the last frame and the current one in seconds.
   * @param {Boolean} [stencilTest] - Indicates whether a stencil mask is active.
   */
  render(renderer, inputBuffer, outputBuffer, deltaTime, stencilTest) {
    const renderTarget = this.renderToScreen ? null : this.renderTarget;
    this.renderPass.render(renderer, renderTarget);
  }
  /**
   * Updates the size of this pass.
   *
   * @param {Number} width - The width.
   * @param {Number} height - The height.
   */
  setSize(width, height) {
    const resolution = this.resolution;
    resolution.setBaseSize(width, height);
    this.renderTarget.setSize(resolution.width, resolution.height);
  }
};
var outline_default3 = `uniform lowp sampler2D edgeTexture;uniform lowp sampler2D maskTexture;uniform vec3 visibleEdgeColor;uniform vec3 hiddenEdgeColor;uniform float pulse;uniform float edgeStrength;
#ifdef USE_PATTERN
uniform lowp sampler2D patternTexture;varying vec2 vUvPattern;
#endif
void mainImage(const in vec4 inputColor,const in vec2 uv,out vec4 outputColor){vec2 edge=texture2D(edgeTexture,uv).rg;vec2 mask=texture2D(maskTexture,uv).rg;
#ifndef X_RAY
edge.y=0.0;
#endif
edge*=(edgeStrength*mask.x*pulse);vec3 color=edge.x*visibleEdgeColor+edge.y*hiddenEdgeColor;float visibilityFactor=0.0;
#ifdef USE_PATTERN
vec4 patternColor=texture2D(patternTexture,vUvPattern);
#ifdef X_RAY
float hiddenFactor=0.5;
#else
float hiddenFactor=0.0;
#endif
visibilityFactor=(1.0-mask.y>0.0)?1.0:hiddenFactor;visibilityFactor*=(1.0-mask.x)*patternColor.a;color+=visibilityFactor*patternColor.rgb;
#endif
float alpha=max(max(edge.x,edge.y),visibilityFactor);
#ifdef ALPHA
outputColor=vec4(color,alpha);
#else
outputColor=vec4(color,max(alpha,inputColor.a));
#endif
}`;
var outline_default4 = `uniform float patternScale;varying vec2 vUvPattern;void mainSupport(const in vec2 uv){vUvPattern=uv*vec2(aspect,1.0)*patternScale;}`;
var OutlineEffect = class extends Effect {
  /**
   * Constructs a new outline effect.
   *
   * @param {Scene} scene - The main scene.
   * @param {Camera} camera - The main camera.
   * @param {Object} [options] - The options.
   * @param {BlendFunction} [options.blendFunction=BlendFunction.SCREEN] - The blend function. Use `BlendFunction.ALPHA` for dark outlines.
   * @param {Texture} [options.patternTexture=null] - A pattern texture.
   * @param {Number} [options.patternScale=1.0] - The pattern scale.
   * @param {Number} [options.edgeStrength=1.0] - The edge strength.
   * @param {Number} [options.pulseSpeed=0.0] - The pulse speed. A value of zero disables the pulse effect.
   * @param {Number} [options.visibleEdgeColor=0xffffff] - The color of visible edges.
   * @param {Number} [options.hiddenEdgeColor=0x22090a] - The color of hidden edges.
   * @param {KernelSize} [options.kernelSize=KernelSize.VERY_SMALL] - The blur kernel size.
   * @param {Boolean} [options.blur=false] - Whether the outline should be blurred.
   * @param {Boolean} [options.xRay=true] - Whether occluded parts of selected objects should be visible.
   * @param {Number} [options.multisampling=0] - The number of samples used for multisample antialiasing. Requires WebGL 2.
   * @param {Number} [options.resolutionScale=0.5] - The resolution scale.
   * @param {Number} [options.resolutionX=Resolution.AUTO_SIZE] - The horizontal resolution.
   * @param {Number} [options.resolutionY=Resolution.AUTO_SIZE] - The vertical resolution.
   * @param {Number} [options.width=Resolution.AUTO_SIZE] - Deprecated. Use resolutionX instead.
   * @param {Number} [options.height=Resolution.AUTO_SIZE] - Deprecated. Use resolutionY instead.
   */
  constructor(scene, camera, {
    blendFunction = BlendFunction.SCREEN,
    patternTexture = null,
    patternScale = 1,
    edgeStrength = 1,
    pulseSpeed = 0,
    visibleEdgeColor = 16777215,
    hiddenEdgeColor = 2230538,
    kernelSize = KernelSize.VERY_SMALL,
    blur = false,
    xRay = true,
    multisampling = 0,
    resolutionScale = 0.5,
    width = Resolution.AUTO_SIZE,
    height = Resolution.AUTO_SIZE,
    resolutionX = width,
    resolutionY = height
  } = {}) {
    super("OutlineEffect", outline_default3, {
      uniforms: /* @__PURE__ */ new Map([
        ["maskTexture", new Uniform(null)],
        ["edgeTexture", new Uniform(null)],
        ["edgeStrength", new Uniform(edgeStrength)],
        ["visibleEdgeColor", new Uniform(new Color(visibleEdgeColor))],
        ["hiddenEdgeColor", new Uniform(new Color(hiddenEdgeColor))],
        ["pulse", new Uniform(1)],
        ["patternScale", new Uniform(patternScale)],
        ["patternTexture", new Uniform(null)]
      ])
    });
    this.blendMode.addEventListener("change", (event) => {
      if (this.blendMode.blendFunction === BlendFunction.ALPHA) {
        this.defines.set("ALPHA", "1");
      } else {
        this.defines.delete("ALPHA");
      }
      this.setChanged();
    });
    this.blendMode.blendFunction = blendFunction;
    this.patternTexture = patternTexture;
    this.xRay = xRay;
    this.scene = scene;
    this.camera = camera;
    this.renderTargetMask = new WebGLRenderTarget(1, 1);
    this.renderTargetMask.samples = multisampling;
    this.renderTargetMask.texture.name = "Outline.Mask";
    this.uniforms.get("maskTexture").value = this.renderTargetMask.texture;
    this.renderTargetOutline = new WebGLRenderTarget(1, 1, { depthBuffer: false });
    this.renderTargetOutline.texture.name = "Outline.Edges";
    this.uniforms.get("edgeTexture").value = this.renderTargetOutline.texture;
    this.clearPass = new ClearPass();
    this.clearPass.overrideClearColor = new Color(0);
    this.clearPass.overrideClearAlpha = 1;
    this.depthPass = new DepthPass(scene, camera);
    this.maskPass = new RenderPass(scene, camera, new DepthComparisonMaterial(this.depthPass.texture, camera));
    const clearPass = this.maskPass.clearPass;
    clearPass.overrideClearColor = new Color(16777215);
    clearPass.overrideClearAlpha = 1;
    this.blurPass = new KawaseBlurPass({ resolutionScale, resolutionX, resolutionY, kernelSize });
    this.blurPass.enabled = blur;
    const resolution = this.blurPass.resolution;
    resolution.addEventListener("change", (e) => this.setSize(resolution.baseWidth, resolution.baseHeight));
    this.outlinePass = new ShaderPass(new OutlineMaterial());
    const outlineMaterial = this.outlinePass.fullscreenMaterial;
    outlineMaterial.inputBuffer = this.renderTargetMask.texture;
    this.time = 0;
    this.forceUpdate = true;
    this.selection = new Selection();
    this.pulseSpeed = pulseSpeed;
  }
  set mainScene(value) {
    this.scene = value;
    this.depthPass.mainScene = value;
    this.maskPass.mainScene = value;
  }
  set mainCamera(value) {
    this.camera = value;
    this.depthPass.mainCamera = value;
    this.maskPass.mainCamera = value;
    this.maskPass.overrideMaterial.copyCameraSettings(value);
  }
  /**
   * The resolution of this effect.
   *
   * @type {Resolution}
   */
  get resolution() {
    return this.blurPass.resolution;
  }
  /**
   * Returns the resolution.
   *
   * @return {Resizer} The resolution.
   */
  getResolution() {
    return this.blurPass.getResolution();
  }
  /**
   * The amount of MSAA samples.
   *
   * Requires WebGL 2. Set to zero to disable multisampling.
   *
   * @experimental Requires three >= r138.
   * @type {Number}
   */
  get multisampling() {
    return this.renderTargetMask.samples;
  }
  set multisampling(value) {
    this.renderTargetMask.samples = value;
    this.renderTargetMask.dispose();
  }
  /**
   * The pattern scale.
   *
   * @type {Number}
   */
  get patternScale() {
    return this.uniforms.get("patternScale").value;
  }
  set patternScale(value) {
    this.uniforms.get("patternScale").value = value;
  }
  /**
   * The edge strength.
   *
   * @type {Number}
   */
  get edgeStrength() {
    return this.uniforms.get("edgeStrength").value;
  }
  set edgeStrength(value) {
    this.uniforms.get("edgeStrength").value = value;
  }
  /**
   * The visible edge color.
   *
   * @type {Color}
   */
  get visibleEdgeColor() {
    return this.uniforms.get("visibleEdgeColor").value;
  }
  set visibleEdgeColor(value) {
    this.uniforms.get("visibleEdgeColor").value = value;
  }
  /**
   * The hidden edge color.
   *
   * @type {Color}
   */
  get hiddenEdgeColor() {
    return this.uniforms.get("hiddenEdgeColor").value;
  }
  set hiddenEdgeColor(value) {
    this.uniforms.get("hiddenEdgeColor").value = value;
  }
  /**
   * Returns the blur pass.
   *
   * @deprecated Use blurPass instead.
   * @return {KawaseBlurPass} The blur pass.
   */
  getBlurPass() {
    return this.blurPass;
  }
  /**
   * Returns the selection.
   *
   * @deprecated Use selection instead.
   * @return {Selection} The selection.
   */
  getSelection() {
    return this.selection;
  }
  /**
   * Returns the pulse speed.
   *
   * @deprecated Use pulseSpeed instead.
   * @return {Number} The speed.
   */
  getPulseSpeed() {
    return this.pulseSpeed;
  }
  /**
   * Sets the pulse speed. Set to zero to disable.
   *
   * @deprecated Use pulseSpeed instead.
   * @param {Number} value - The speed.
   */
  setPulseSpeed(value) {
    this.pulseSpeed = value;
  }
  /**
   * The current width of the internal render targets.
   *
   * @type {Number}
   * @deprecated Use resolution.width instead.
   */
  get width() {
    return this.resolution.width;
  }
  set width(value) {
    this.resolution.preferredWidth = value;
  }
  /**
   * The current height of the internal render targets.
   *
   * @type {Number}
   * @deprecated Use resolution.height instead.
   */
  get height() {
    return this.resolution.height;
  }
  set height(value) {
    this.resolution.preferredHeight = value;
  }
  /**
   * The selection layer.
   *
   * @type {Number}
   * @deprecated Use selection.layer instead.
   */
  get selectionLayer() {
    return this.selection.layer;
  }
  set selectionLayer(value) {
    this.selection.layer = value;
  }
  /**
   * Indicates whether dithering is enabled.
   *
   * @type {Boolean}
   * @deprecated
   */
  get dithering() {
    return this.blurPass.dithering;
  }
  set dithering(value) {
    this.blurPass.dithering = value;
  }
  /**
   * The blur kernel size.
   *
   * @type {KernelSize}
   * @deprecated Use blurPass.kernelSize instead.
   */
  get kernelSize() {
    return this.blurPass.kernelSize;
  }
  set kernelSize(value) {
    this.blurPass.kernelSize = value;
  }
  /**
   * Indicates whether the outlines should be blurred.
   *
   * @type {Boolean}
   * @deprecated Use blurPass.enabled instead.
   */
  get blur() {
    return this.blurPass.enabled;
  }
  set blur(value) {
    this.blurPass.enabled = value;
  }
  /**
   * Indicates whether X-ray mode is enabled.
   *
   * @type {Boolean}
   */
  get xRay() {
    return this.defines.has("X_RAY");
  }
  set xRay(value) {
    if (this.xRay !== value) {
      if (value) {
        this.defines.set("X_RAY", "1");
      } else {
        this.defines.delete("X_RAY");
      }
      this.setChanged();
    }
  }
  /**
   * Indicates whether X-ray mode is enabled.
   *
   * @deprecated Use xRay instead.
   * @return {Boolean} Whether X-ray mode is enabled.
   */
  isXRayEnabled() {
    return this.xRay;
  }
  /**
   * Enables or disables X-ray outlines.
   *
   * @deprecated Use xRay instead.
   * @param {Boolean} value - Whether X-ray should be enabled.
   */
  setXRayEnabled(value) {
    this.xRay = value;
  }
  /**
   * The pattern texture. Set to `null` to disable.
   *
   * @type {Texture}
   */
  get patternTexture() {
    return this.uniforms.get("patternTexture").value;
  }
  set patternTexture(value) {
    if (value !== null) {
      value.wrapS = value.wrapT = RepeatWrapping;
      this.defines.set("USE_PATTERN", "1");
      this.setVertexShader(outline_default4);
    } else {
      this.defines.delete("USE_PATTERN");
      this.setVertexShader(null);
    }
    this.uniforms.get("patternTexture").value = value;
    this.setChanged();
  }
  /**
   * Sets the pattern texture.
   *
   * @deprecated Use patternTexture instead.
   * @param {Texture} value - The new texture.
   */
  setPatternTexture(value) {
    this.patternTexture = value;
  }
  /**
   * Returns the current resolution scale.
   *
   * @return {Number} The resolution scale.
   * @deprecated Use resolution instead.
   */
  getResolutionScale() {
    return this.resolution.scale;
  }
  /**
   * Sets the resolution scale.
   *
   * @param {Number} scale - The new resolution scale.
   * @deprecated Use resolution instead.
   */
  setResolutionScale(scale3) {
    this.resolution.scale = scale3;
  }
  /**
   * Clears the current selection and selects a list of objects.
   *
   * @param {Object3D[]} objects - The objects that should be outlined. This array will be copied.
   * @return {OutlinePass} This pass.
   * @deprecated Use selection.set() instead.
   */
  setSelection(objects) {
    this.selection.set(objects);
    return this;
  }
  /**
   * Clears the list of selected objects.
   *
   * @return {OutlinePass} This pass.
   * @deprecated Use selection.clear() instead.
   */
  clearSelection() {
    this.selection.clear();
    return this;
  }
  /**
   * Selects an object.
   *
   * @param {Object3D} object - The object that should be outlined.
   * @return {OutlinePass} This pass.
   * @deprecated Use selection.add() instead.
   */
  selectObject(object) {
    this.selection.add(object);
    return this;
  }
  /**
   * Deselects an object.
   *
   * @param {Object3D} object - The object that should no longer be outlined.
   * @return {OutlinePass} This pass.
   * @deprecated Use selection.delete() instead.
   */
  deselectObject(object) {
    this.selection.delete(object);
    return this;
  }
  /**
   * Updates this effect.
   *
   * @param {WebGLRenderer} renderer - The renderer.
   * @param {WebGLRenderTarget} inputBuffer - A frame buffer that contains the result of the previous pass.
   * @param {Number} [deltaTime] - The time between the last frame and the current one in seconds.
   */
  update(renderer, inputBuffer, deltaTime) {
    const scene = this.scene;
    const camera = this.camera;
    const selection = this.selection;
    const uniforms = this.uniforms;
    const pulse = uniforms.get("pulse");
    const background = scene.background;
    const mask = camera.layers.mask;
    if (this.forceUpdate || selection.size > 0) {
      scene.background = null;
      pulse.value = 1;
      if (this.pulseSpeed > 0) {
        pulse.value = Math.cos(this.time * this.pulseSpeed * 10) * 0.375 + 0.625;
      }
      this.time += deltaTime;
      selection.setVisible(false);
      this.depthPass.render(renderer);
      selection.setVisible(true);
      camera.layers.set(selection.layer);
      this.maskPass.render(renderer, this.renderTargetMask);
      camera.layers.mask = mask;
      scene.background = background;
      this.outlinePass.render(renderer, null, this.renderTargetOutline);
      if (this.blurPass.enabled) {
        this.blurPass.render(renderer, this.renderTargetOutline, this.renderTargetOutline);
      }
    }
    this.forceUpdate = selection.size > 0;
  }
  /**
   * Updates the size of internal render targets.
   *
   * @param {Number} width - The width.
   * @param {Number} height - The height.
   */
  setSize(width, height) {
    this.blurPass.setSize(width, height);
    this.renderTargetMask.setSize(width, height);
    const resolution = this.resolution;
    resolution.setBaseSize(width, height);
    const w2 = resolution.width, h = resolution.height;
    this.depthPass.setSize(w2, h);
    this.renderTargetOutline.setSize(w2, h);
    this.outlinePass.fullscreenMaterial.setSize(w2, h);
  }
  /**
   * Performs initialization tasks.
   *
   * @param {WebGLRenderer} renderer - The renderer.
   * @param {Boolean} alpha - Whether the renderer uses the alpha channel or not.
   * @param {Number} frameBufferType - The type of the main frame buffers.
   */
  initialize(renderer, alpha, frameBufferType) {
    this.blurPass.initialize(renderer, alpha, UnsignedByteType);
    if (frameBufferType !== void 0) {
      this.depthPass.initialize(renderer, alpha, frameBufferType);
      this.maskPass.initialize(renderer, alpha, frameBufferType);
      this.outlinePass.initialize(renderer, alpha, frameBufferType);
    }
  }
};
var pixelation_default = `uniform bool active;uniform vec4 d;void mainUv(inout vec2 uv){if(active){uv=d.xy*(floor(uv*d.zw)+0.5);}}`;
var PixelationEffect = class extends Effect {
  /**
   * Constructs a new pixelation effect.
   *
   * @param {Object} [granularity=30.0] - The pixel granularity.
   */
  constructor(granularity = 30) {
    super("PixelationEffect", pixelation_default, {
      uniforms: /* @__PURE__ */ new Map([
        ["active", new Uniform(false)],
        ["d", new Uniform(new Vector4())]
      ])
    });
    this.resolution = new Vector2();
    this._granularity = 0;
    this.granularity = granularity;
  }
  /**
   * The pixel granularity.
   *
   * A higher value yields coarser visuals.
   *
   * @type {Number}
   */
  get granularity() {
    return this._granularity;
  }
  set granularity(value) {
    let d = Math.floor(value);
    if (d % 2 > 0) {
      d += 1;
    }
    this._granularity = d;
    this.uniforms.get("active").value = d > 0;
    this.setSize(this.resolution.width, this.resolution.height);
  }
  /**
   * Returns the pixel granularity.
   *
   * @deprecated Use granularity instead.
   * @return {Number} The granularity.
   */
  getGranularity() {
    return this.granularity;
  }
  /**
   * Sets the pixel granularity.
   *
   * @deprecated Use granularity instead.
   * @param {Number} value - The new granularity.
   */
  setGranularity(value) {
    this.granularity = value;
  }
  /**
   * Updates the granularity.
   *
   * @param {Number} width - The width.
   * @param {Number} height - The height.
   */
  setSize(width, height) {
    const resolution = this.resolution;
    resolution.set(width, height);
    const d = this.granularity;
    const x = d / resolution.x;
    const y = d / resolution.y;
    this.uniforms.get("d").value.set(x, y, 1 / x, 1 / y);
  }
};
var scanlines_default = `uniform float count;
#ifdef SCROLL
uniform float scrollSpeed;
#endif
void mainImage(const in vec4 inputColor,const in vec2 uv,out vec4 outputColor){float y=uv.y;
#ifdef SCROLL
y+=time*scrollSpeed;
#endif
vec2 sl=vec2(sin(y*count),cos(y*count));outputColor=vec4(sl.xyx,inputColor.a);}`;
var ScanlineEffect = class extends Effect {
  /**
   * Constructs a new scanline effect.
   *
   * @param {Object} [options] - The options.
   * @param {BlendFunction} [options.blendFunction=BlendFunction.OVERLAY] - The blend function of this effect.
   * @param {Number} [options.density=1.25] - The scanline density.
   * @param {Number} [options.scrollSpeed=0.0] - The scanline scroll speed.
   */
  constructor({ blendFunction = BlendFunction.OVERLAY, density = 1.25, scrollSpeed = 0 } = {}) {
    super("ScanlineEffect", scanlines_default, {
      blendFunction,
      uniforms: /* @__PURE__ */ new Map([
        ["count", new Uniform(0)],
        ["scrollSpeed", new Uniform(0)]
      ])
    });
    this.resolution = new Vector2();
    this.d = density;
    this.scrollSpeed = scrollSpeed;
  }
  /**
   * The scanline density.
   *
   * @type {Number}
   */
  get density() {
    return this.d;
  }
  set density(value) {
    this.d = value;
    this.setSize(this.resolution.width, this.resolution.height);
  }
  /**
   * Returns the current scanline density.
   *
   * @deprecated Use density instead.
   * @return {Number} The scanline density.
   */
  getDensity() {
    return this.density;
  }
  /**
   * Sets the scanline density.
   *
   * @deprecated Use density instead.
   * @param {Number} value - The new scanline density.
   */
  setDensity(value) {
    this.density = value;
  }
  /**
   * The scanline scroll speed. Default is 0 (disabled).
   *
   * @type {Number}
   */
  get scrollSpeed() {
    return this.uniforms.get("scrollSpeed").value;
  }
  set scrollSpeed(value) {
    this.uniforms.get("scrollSpeed").value = value;
    if (value === 0) {
      if (this.defines.delete("SCROLL")) {
        this.setChanged();
      }
    } else if (!this.defines.has("SCROLL")) {
      this.defines.set("SCROLL", "1");
      this.setChanged();
    }
  }
  /**
   * Updates the size of this pass.
   *
   * @param {Number} width - The width.
   * @param {Number} height - The height.
   */
  setSize(width, height) {
    this.resolution.set(width, height);
    this.uniforms.get("count").value = Math.round(height * this.density);
  }
};
var shock_wave_default = `uniform bool active;uniform vec2 center;uniform float waveSize;uniform float radius;uniform float maxRadius;uniform float amplitude;varying float vSize;void mainUv(inout vec2 uv){if(active){vec2 aspectCorrection=vec2(aspect,1.0);vec2 difference=uv*aspectCorrection-center*aspectCorrection;float distance=sqrt(dot(difference,difference))*vSize;if(distance>radius){if(distance<radius+waveSize){float angle=(distance-radius)*PI2/waveSize;float cosSin=(1.0-cos(angle))*0.5;float extent=maxRadius+waveSize;float decay=max(extent-distance*distance,0.0)/extent;uv-=((cosSin*amplitude*difference)/distance)*decay;}}}}`;
var shock_wave_default2 = `uniform float size;uniform float cameraDistance;varying float vSize;void mainSupport(){vSize=(0.1*cameraDistance)/size;}`;
var HALF_PI = Math.PI * 0.5;
var v2 = new Vector3();
var ab = new Vector3();
var ShockWaveEffect = class extends Effect {
  /**
   * Constructs a new shock wave effect.
   *
   * @param {Camera} camera - The main camera.
   * @param {Vector3} [position] - The world position of the shock wave.
   * @param {Object} [options] - The options.
   * @param {Number} [options.speed=2.0] - The animation speed.
   * @param {Number} [options.maxRadius=1.0] - The extent of the shock wave.
   * @param {Number} [options.waveSize=0.2] - The wave size.
   * @param {Number} [options.amplitude=0.05] - The distortion amplitude.
   */
  constructor(camera, position = new Vector3(), {
    speed = 2,
    maxRadius = 1,
    waveSize = 0.2,
    amplitude = 0.05
  } = {}) {
    super("ShockWaveEffect", shock_wave_default, {
      vertexShader: shock_wave_default2,
      uniforms: /* @__PURE__ */ new Map([
        ["active", new Uniform(false)],
        ["center", new Uniform(new Vector2(0.5, 0.5))],
        ["cameraDistance", new Uniform(1)],
        ["size", new Uniform(1)],
        ["radius", new Uniform(-waveSize)],
        ["maxRadius", new Uniform(maxRadius)],
        ["waveSize", new Uniform(waveSize)],
        ["amplitude", new Uniform(amplitude)]
      ])
    });
    this.position = position;
    this.speed = speed;
    this.camera = camera;
    this.screenPosition = this.uniforms.get("center").value;
    this.time = 0;
    this.active = false;
  }
  set mainCamera(value) {
    this.camera = value;
  }
  /**
   * The amplitude.
   *
   * @type {Number}
   */
  get amplitude() {
    return this.uniforms.get("amplitude").value;
  }
  set amplitude(value) {
    this.uniforms.get("amplitude").value = value;
  }
  /**
   * The wave size.
   *
   * @type {Number}
   */
  get waveSize() {
    return this.uniforms.get("waveSize").value;
  }
  set waveSize(value) {
    this.uniforms.get("waveSize").value = value;
  }
  /**
   * The maximum radius.
   *
   * @type {Number}
   */
  get maxRadius() {
    return this.uniforms.get("maxRadius").value;
  }
  set maxRadius(value) {
    this.uniforms.get("maxRadius").value = value;
  }
  /**
   * The position of the shock wave.
   *
   * @type {Vector3}
   * @deprecated Use position instead.
   */
  get epicenter() {
    return this.position;
  }
  set epicenter(value) {
    this.position = value;
  }
  /**
   * Returns the position of the shock wave.
   *
   * @deprecated Use position instead.
   * @return {Vector3} The position.
   */
  getPosition() {
    return this.position;
  }
  /**
   * Sets the position of the shock wave.
   *
   * @deprecated Use position instead.
   * @param {Vector3} value - The position.
   */
  setPosition(value) {
    this.position = value;
  }
  /**
   * Returns the speed of the shock wave.
   *
   * @deprecated Use speed instead.
   * @return {Number} The speed.
   */
  getSpeed() {
    return this.speed;
  }
  /**
   * Sets the speed of the shock wave.
   *
   * @deprecated Use speed instead.
   * @param {Number} value - The speed.
   */
  setSpeed(value) {
    this.speed = value;
  }
  /**
   * Emits the shock wave.
   */
  explode() {
    this.time = 0;
    this.active = true;
    this.uniforms.get("active").value = true;
  }
  /**
   * Updates this effect.
   *
   * @param {WebGLRenderer} renderer - The renderer.
   * @param {WebGLRenderTarget} inputBuffer - A frame buffer that contains the result of the previous pass.
   * @param {Number} [delta] - The time between the last frame and the current one in seconds.
   */
  update(renderer, inputBuffer, delta) {
    const position = this.position;
    const camera = this.camera;
    const uniforms = this.uniforms;
    const uActive = uniforms.get("active");
    if (this.active) {
      const waveSize = uniforms.get("waveSize").value;
      camera.getWorldDirection(v2);
      ab.copy(camera.position).sub(position);
      uActive.value = v2.angleTo(ab) > HALF_PI;
      if (uActive.value) {
        uniforms.get("cameraDistance").value = camera.position.distanceTo(position);
        v2.copy(position).project(camera);
        this.screenPosition.set((v2.x + 1) * 0.5, (v2.y + 1) * 0.5);
      }
      this.time += delta * this.speed;
      const radius = this.time - waveSize;
      uniforms.get("radius").value = radius;
      if (radius >= (uniforms.get("maxRadius").value + waveSize) * 2) {
        this.active = false;
        uActive.value = false;
      }
    }
  }
};
var SelectiveBloomEffect = class extends BloomEffect {
  /**
   * Constructs a new selective bloom effect.
   *
   * @param {Scene} scene - The main scene.
   * @param {Camera} camera - The main camera.
   * @param {Object} [options] - The options. See {@link BloomEffect} for details.
   */
  constructor(scene, camera, options) {
    super(options);
    this.setAttributes(this.getAttributes() | EffectAttribute.DEPTH);
    this.camera = camera;
    this.depthPass = new DepthPass(scene, camera);
    this.clearPass = new ClearPass(true, false, false);
    this.clearPass.overrideClearColor = new Color(0);
    this.depthMaskPass = new ShaderPass(new DepthMaskMaterial());
    const depthMaskMaterial = this.depthMaskMaterial;
    depthMaskMaterial.copyCameraSettings(camera);
    depthMaskMaterial.depthBuffer1 = this.depthPass.texture;
    depthMaskMaterial.depthPacking1 = RGBADepthPacking;
    depthMaskMaterial.depthMode = EqualDepth;
    this.renderTargetMasked = new WebGLRenderTarget(1, 1, { depthBuffer: false });
    this.renderTargetMasked.texture.name = "Bloom.Masked";
    this.selection = new Selection();
    this._inverted = false;
    this._ignoreBackground = false;
  }
  set mainScene(value) {
    this.depthPass.mainScene = value;
  }
  set mainCamera(value) {
    this.camera = value;
    this.depthPass.mainCamera = value;
    this.depthMaskMaterial.copyCameraSettings(value);
  }
  /**
   * Returns the selection.
   *
   * @deprecated Use selection instead.
   * @return {Selection} The selection.
   */
  getSelection() {
    return this.selection;
  }
  /**
   * The depth mask material.
   *
   * @type {DepthMaskMaterial}
   * @private
   */
  get depthMaskMaterial() {
    return this.depthMaskPass.fullscreenMaterial;
  }
  /**
   * Indicates whether the selection should be considered inverted.
   *
   * @type {Boolean}
   */
  get inverted() {
    return this._inverted;
  }
  set inverted(value) {
    this._inverted = value;
    this.depthMaskMaterial.depthMode = value ? NotEqualDepth : EqualDepth;
  }
  /**
   * Indicates whether the mask is inverted.
   *
   * @deprecated Use inverted instead.
   * @return {Boolean} Whether the mask is inverted.
   */
  isInverted() {
    return this.inverted;
  }
  /**
   * Enables or disable mask inversion.
   *
   * @deprecated Use inverted instead.
   * @param {Boolean} value - Whether the mask should be inverted.
   */
  setInverted(value) {
    this.inverted = value;
  }
  /**
   * Indicates whether the background colors will be ignored.
   *
   * @type {Boolean}
   */
  get ignoreBackground() {
    return this._ignoreBackground;
  }
  set ignoreBackground(value) {
    this._ignoreBackground = value;
    this.depthMaskMaterial.maxDepthStrategy = value ? DepthTestStrategy.DISCARD_MAX_DEPTH : DepthTestStrategy.KEEP_MAX_DEPTH;
  }
  /**
   * Indicates whether the background is disabled.
   *
   * @deprecated Use ignoreBackground instead.
   * @return {Boolean} Whether the background is disabled.
   */
  isBackgroundDisabled() {
    return this.ignoreBackground;
  }
  /**
   * Enables or disables the background.
   *
   * @deprecated Use ignoreBackground instead.
   * @param {Boolean} value - Whether the background should be disabled.
   */
  setBackgroundDisabled(value) {
    this.ignoreBackground = value;
  }
  /**
   * Sets the depth texture.
   *
   * @param {Texture} depthTexture - A depth texture.
   * @param {DepthPackingStrategies} [depthPacking=BasicDepthPacking] - The depth packing.
   */
  setDepthTexture(depthTexture, depthPacking = BasicDepthPacking) {
    this.depthMaskMaterial.depthBuffer0 = depthTexture;
    this.depthMaskMaterial.depthPacking0 = depthPacking;
  }
  /**
   * Updates this effect.
   *
   * @param {WebGLRenderer} renderer - The renderer.
   * @param {WebGLRenderTarget} inputBuffer - A frame buffer that contains the result of the previous pass.
   * @param {Number} [deltaTime] - The time between the last frame and the current one in seconds.
   */
  update(renderer, inputBuffer, deltaTime) {
    const camera = this.camera;
    const selection = this.selection;
    const inverted = this.inverted;
    let renderTarget = inputBuffer;
    if (this.ignoreBackground || !inverted || selection.size > 0) {
      const mask = camera.layers.mask;
      camera.layers.set(selection.layer);
      this.depthPass.render(renderer);
      camera.layers.mask = mask;
      renderTarget = this.renderTargetMasked;
      this.clearPass.render(renderer, renderTarget);
      this.depthMaskPass.render(renderer, inputBuffer, renderTarget);
    }
    super.update(renderer, renderTarget, deltaTime);
  }
  /**
   * Updates the size of internal render targets.
   *
   * @param {Number} width - The width.
   * @param {Number} height - The height.
   */
  setSize(width, height) {
    super.setSize(width, height);
    this.renderTargetMasked.setSize(width, height);
    this.depthPass.setSize(width, height);
  }
  /**
   * Performs initialization tasks.
   *
   * @param {WebGLRenderer} renderer - The renderer.
   * @param {Boolean} alpha - Whether the renderer uses the alpha channel.
   * @param {Number} frameBufferType - The type of the main frame buffers.
   */
  initialize(renderer, alpha, frameBufferType) {
    super.initialize(renderer, alpha, frameBufferType);
    this.clearPass.initialize(renderer, alpha, frameBufferType);
    this.depthPass.initialize(renderer, alpha, frameBufferType);
    this.depthMaskPass.initialize(renderer, alpha, frameBufferType);
    if (renderer !== null && renderer.capabilities.logarithmicDepthBuffer) {
      this.depthMaskPass.fullscreenMaterial.defines.LOG_DEPTH = "1";
    }
    if (frameBufferType !== void 0) {
      this.renderTargetMasked.texture.type = frameBufferType;
      if (renderer !== null && renderer.outputColorSpace === SRGBColorSpace) {
        this.renderTargetMasked.texture.colorSpace = SRGBColorSpace;
      }
    }
  }
};
var sepia_default = `uniform vec3 weightsR;uniform vec3 weightsG;uniform vec3 weightsB;void mainImage(const in vec4 inputColor,const in vec2 uv,out vec4 outputColor){vec3 color=vec3(dot(inputColor.rgb,weightsR),dot(inputColor.rgb,weightsG),dot(inputColor.rgb,weightsB));outputColor=vec4(color,inputColor.a);}`;
var SepiaEffect = class extends Effect {
  /**
   * Constructs a new sepia effect.
   *
   * @param {Object} [options] - The options.
   * @param {BlendFunction} [options.blendFunction] - The blend function of this effect.
   * @param {Number} [options.intensity=1.0] - The intensity of the effect.
   */
  constructor({ blendFunction, intensity = 1 } = {}) {
    super("SepiaEffect", sepia_default, {
      blendFunction,
      uniforms: /* @__PURE__ */ new Map([
        ["weightsR", new Uniform(new Vector3(0.393, 0.769, 0.189))],
        ["weightsG", new Uniform(new Vector3(0.349, 0.686, 0.168))],
        ["weightsB", new Uniform(new Vector3(0.272, 0.534, 0.131))]
      ])
    });
  }
  /**
   * The intensity.
   *
   * @deprecated Use blendMode.opacity instead.
   * @type {Number}
   */
  get intensity() {
    return this.blendMode.opacity.value;
  }
  set intensity(value) {
    this.blendMode.opacity.value = value;
  }
  /**
   * Returns the current sepia intensity.
   *
   * @deprecated Use blendMode.opacity instead.
   * @return {Number} The intensity.
   */
  getIntensity() {
    return this.intensity;
  }
  /**
   * Sets the sepia intensity.
   *
   * @deprecated Use blendMode.opacity instead.
   * @param {Number} value - The intensity.
   */
  setIntensity(value) {
    this.intensity = value;
  }
  /**
   * The weights for the red channel. Default is `(0.393, 0.769, 0.189)`.
   *
   * @type {Vector3}
   */
  get weightsR() {
    return this.uniforms.get("weightsR").value;
  }
  /**
   * The weights for the green channel. Default is `(0.349, 0.686, 0.168)`.
   *
   * @type {Vector3}
   */
  get weightsG() {
    return this.uniforms.get("weightsG").value;
  }
  /**
   * The weights for the blue channel. Default is `(0.272, 0.534, 0.131)`.
   *
   * @type {Vector3}
   */
  get weightsB() {
    return this.uniforms.get("weightsB").value;
  }
};
var edge_detection_default = `varying vec2 vUv;varying vec2 vUv0;varying vec2 vUv1;
#if EDGE_DETECTION_MODE != 0
varying vec2 vUv2;varying vec2 vUv3;varying vec2 vUv4;varying vec2 vUv5;
#endif
#if EDGE_DETECTION_MODE == 1
#include <common>
#endif
#if EDGE_DETECTION_MODE == 0 || PREDICATION_MODE == 1
#ifdef GL_FRAGMENT_PRECISION_HIGH
uniform highp sampler2D depthBuffer;
#else
uniform mediump sampler2D depthBuffer;
#endif
float readDepth(const in vec2 uv){
#if DEPTH_PACKING == 3201
return unpackRGBAToDepth(texture2D(depthBuffer,uv));
#else
return texture2D(depthBuffer,uv).r;
#endif
}vec3 gatherNeighbors(){float p=readDepth(vUv);float pLeft=readDepth(vUv0);float pTop=readDepth(vUv1);return vec3(p,pLeft,pTop);}
#elif PREDICATION_MODE == 2
uniform sampler2D predicationBuffer;vec3 gatherNeighbors(){float p=texture2D(predicationBuffer,vUv).r;float pLeft=texture2D(predicationBuffer,vUv0).r;float pTop=texture2D(predicationBuffer,vUv1).r;return vec3(p,pLeft,pTop);}
#endif
#if PREDICATION_MODE != 0
vec2 calculatePredicatedThreshold(){vec3 neighbours=gatherNeighbors();vec2 delta=abs(neighbours.xx-neighbours.yz);vec2 edges=step(PREDICATION_THRESHOLD,delta);return PREDICATION_SCALE*EDGE_THRESHOLD*(1.0-PREDICATION_STRENGTH*edges);}
#endif
#if EDGE_DETECTION_MODE != 0
uniform sampler2D inputBuffer;
#endif
void main(){
#if EDGE_DETECTION_MODE == 0
const vec2 threshold=vec2(DEPTH_THRESHOLD);
#elif PREDICATION_MODE != 0
vec2 threshold=calculatePredicatedThreshold();
#else
const vec2 threshold=vec2(EDGE_THRESHOLD);
#endif
#if EDGE_DETECTION_MODE == 0
vec3 neighbors=gatherNeighbors();vec2 delta=abs(neighbors.xx-vec2(neighbors.y,neighbors.z));vec2 edges=step(threshold,delta);if(dot(edges,vec2(1.0))==0.0){discard;}gl_FragColor=vec4(edges,0.0,1.0);
#elif EDGE_DETECTION_MODE == 1
float l=luminance(texture2D(inputBuffer,vUv).rgb);float lLeft=luminance(texture2D(inputBuffer,vUv0).rgb);float lTop=luminance(texture2D(inputBuffer,vUv1).rgb);vec4 delta;delta.xy=abs(l-vec2(lLeft,lTop));vec2 edges=step(threshold,delta.xy);if(dot(edges,vec2(1.0))==0.0){discard;}float lRight=luminance(texture2D(inputBuffer,vUv2).rgb);float lBottom=luminance(texture2D(inputBuffer,vUv3).rgb);delta.zw=abs(l-vec2(lRight,lBottom));vec2 maxDelta=max(delta.xy,delta.zw);float lLeftLeft=luminance(texture2D(inputBuffer,vUv4).rgb);float lTopTop=luminance(texture2D(inputBuffer,vUv5).rgb);delta.zw=abs(vec2(lLeft,lTop)-vec2(lLeftLeft,lTopTop));maxDelta=max(maxDelta.xy,delta.zw);float finalDelta=max(maxDelta.x,maxDelta.y);edges.xy*=step(finalDelta,LOCAL_CONTRAST_ADAPTATION_FACTOR*delta.xy);gl_FragColor=vec4(edges,0.0,1.0);
#elif EDGE_DETECTION_MODE == 2
vec4 delta;vec3 c=texture2D(inputBuffer,vUv).rgb;vec3 cLeft=texture2D(inputBuffer,vUv0).rgb;vec3 t=abs(c-cLeft);delta.x=max(max(t.r,t.g),t.b);vec3 cTop=texture2D(inputBuffer,vUv1).rgb;t=abs(c-cTop);delta.y=max(max(t.r,t.g),t.b);vec2 edges=step(threshold,delta.xy);if(dot(edges,vec2(1.0))==0.0){discard;}vec3 cRight=texture2D(inputBuffer,vUv2).rgb;t=abs(c-cRight);delta.z=max(max(t.r,t.g),t.b);vec3 cBottom=texture2D(inputBuffer,vUv3).rgb;t=abs(c-cBottom);delta.w=max(max(t.r,t.g),t.b);vec2 maxDelta=max(delta.xy,delta.zw);vec3 cLeftLeft=texture2D(inputBuffer,vUv4).rgb;t=abs(c-cLeftLeft);delta.z=max(max(t.r,t.g),t.b);vec3 cTopTop=texture2D(inputBuffer,vUv5).rgb;t=abs(c-cTopTop);delta.w=max(max(t.r,t.g),t.b);maxDelta=max(maxDelta.xy,delta.zw);float finalDelta=max(maxDelta.x,maxDelta.y);edges*=step(finalDelta,LOCAL_CONTRAST_ADAPTATION_FACTOR*delta.xy);gl_FragColor=vec4(edges,0.0,1.0);
#endif
}`;
var edge_detection_default2 = `uniform vec2 texelSize;varying vec2 vUv;varying vec2 vUv0;varying vec2 vUv1;
#if EDGE_DETECTION_MODE != 0
varying vec2 vUv2;varying vec2 vUv3;varying vec2 vUv4;varying vec2 vUv5;
#endif
void main(){vUv=position.xy*0.5+0.5;vUv0=vUv+texelSize*vec2(-1.0,0.0);vUv1=vUv+texelSize*vec2(0.0,-1.0);
#if EDGE_DETECTION_MODE != 0
vUv2=vUv+texelSize*vec2(1.0,0.0);vUv3=vUv+texelSize*vec2(0.0,1.0);vUv4=vUv+texelSize*vec2(-2.0,0.0);vUv5=vUv+texelSize*vec2(0.0,-2.0);
#endif
gl_Position=vec4(position.xy,1.0,1.0);}`;
var EdgeDetectionMaterial = class extends ShaderMaterial {
  /**
   * Constructs a new edge detection material.
   *
   * TODO Remove parameters.
   * @param {Vector2} [texelSize] - The screen texel size.
   * @param {EdgeDetectionMode} [mode=EdgeDetectionMode.COLOR] - The edge detection mode.
   */
  constructor(texelSize = new Vector2(), mode = EdgeDetectionMode.COLOR) {
    super({
      name: "EdgeDetectionMaterial",
      defines: {
        THREE_REVISION: REVISION.replace(/\D+/g, ""),
        LOCAL_CONTRAST_ADAPTATION_FACTOR: "2.0",
        EDGE_THRESHOLD: "0.1",
        DEPTH_THRESHOLD: "0.01",
        PREDICATION_MODE: "0",
        PREDICATION_THRESHOLD: "0.01",
        PREDICATION_SCALE: "2.0",
        PREDICATION_STRENGTH: "1.0",
        DEPTH_PACKING: "0"
      },
      uniforms: {
        inputBuffer: new Uniform(null),
        depthBuffer: new Uniform(null),
        predicationBuffer: new Uniform(null),
        texelSize: new Uniform(texelSize)
      },
      blending: NoBlending,
      toneMapped: false,
      depthWrite: false,
      depthTest: false,
      fragmentShader: edge_detection_default,
      vertexShader: edge_detection_default2
    });
    this.edgeDetectionMode = mode;
  }
  /**
   * The depth buffer.
   *
   * @type {Texture}
   */
  set depthBuffer(value) {
    this.uniforms.depthBuffer.value = value;
  }
  /**
   * The depth packing strategy.
   *
   * @type {DepthPackingStrategies}
   */
  set depthPacking(value) {
    this.defines.DEPTH_PACKING = value.toFixed(0);
    this.needsUpdate = true;
  }
  /**
   * Sets the depth buffer.
   *
   * @deprecated Use depthBuffer and depthPacking instead.
   * @param {Texture} buffer - The depth texture.
   * @param {DepthPackingStrategies} [depthPacking=BasicDepthPacking] - The depth packing strategy.
   */
  setDepthBuffer(buffer2, depthPacking = BasicDepthPacking) {
    this.depthBuffer = buffer2;
    this.depthPacking = depthPacking;
  }
  /**
   * The edge detection mode.
   *
   * @type {EdgeDetectionMode}
   */
  get edgeDetectionMode() {
    return Number(this.defines.EDGE_DETECTION_MODE);
  }
  set edgeDetectionMode(value) {
    this.defines.EDGE_DETECTION_MODE = value.toFixed(0);
    this.needsUpdate = true;
  }
  /**
   * Returns the edge detection mode.
   *
   * @deprecated Use edgeDetectionMode instead.
   * @return {EdgeDetectionMode} The mode.
   */
  getEdgeDetectionMode() {
    return this.edgeDetectionMode;
  }
  /**
   * Sets the edge detection mode.
   *
   * @deprecated Use edgeDetectionMode instead.
   * @param {EdgeDetectionMode} value - The edge detection mode.
   */
  setEdgeDetectionMode(value) {
    this.edgeDetectionMode = value;
  }
  /**
   * The local contrast adaptation factor. Has no effect if the edge detection mode is set to DEPTH. Default is 2.0.
   *
   * If a neighbor edge has _factor_ times bigger contrast than the current edge, the edge will be discarded.
   *
   * This allows to eliminate spurious crossing edges and is based on the fact that if there is too much contrast in a
   * direction, the perceptual contrast in the other neighbors will be hidden.
   *
   * @type {Number}
   */
  get localContrastAdaptationFactor() {
    return Number(this.defines.LOCAL_CONTRAST_ADAPTATION_FACTOR);
  }
  set localContrastAdaptationFactor(value) {
    this.defines.LOCAL_CONTRAST_ADAPTATION_FACTOR = value.toFixed("6");
    this.needsUpdate = true;
  }
  /**
   * Returns the local contrast adaptation factor.
   *
   * @deprecated Use localContrastAdaptationFactor instead.
   * @return {Number} The factor.
   */
  getLocalContrastAdaptationFactor() {
    return this.localContrastAdaptationFactor;
  }
  /**
   * Sets the local contrast adaptation factor. Has no effect if the edge detection mode is set to DEPTH.
   *
   * @deprecated Use localContrastAdaptationFactor instead.
   * @param {Number} value - The local contrast adaptation factor. Default is 2.0.
   */
  setLocalContrastAdaptationFactor(value) {
    this.localContrastAdaptationFactor = value;
  }
  /**
   * The edge detection threshold. Range: [0.0, 0.5].
   *
   * A lower value results in more edges being detected at the expense of performance.
   *
   * For luma- and chroma-based edge detection, 0.1 is a reasonable value and allows to catch most visible edges. 0.05
   * is a rather overkill value that allows to catch 'em all. Darker scenes may require an even lower threshold.
   *
   * If depth-based edge detection is used, the threshold will depend on the scene depth.
   *
   * @type {Number}
   */
  get edgeDetectionThreshold() {
    return Number(this.defines.EDGE_THRESHOLD);
  }
  set edgeDetectionThreshold(value) {
    this.defines.EDGE_THRESHOLD = value.toFixed("6");
    this.defines.DEPTH_THRESHOLD = (value * 0.1).toFixed("6");
    this.needsUpdate = true;
  }
  /**
   * Returns the edge detection threshold.
   *
   * @deprecated Use edgeDetectionThreshold instead.
   * @return {Number} The threshold.
   */
  getEdgeDetectionThreshold() {
    return this.edgeDetectionThreshold;
  }
  /**
   * Sets the edge detection threshold.
   *
   * @deprecated Use edgeDetectionThreshold instead.
   * @param {Number} value - The edge detection threshold. Range: [0.0, 0.5].
   */
  setEdgeDetectionThreshold(value) {
    this.edgeDetectionThreshold = value;
  }
  /**
   * The predication mode.
   *
   * Predicated thresholding allows to better preserve texture details and to improve edge detection using an additional
   * buffer such as a light accumulation or depth buffer.
   *
   * @type {PredicationMode}
   */
  get predicationMode() {
    return Number(this.defines.PREDICATION_MODE);
  }
  set predicationMode(value) {
    this.defines.PREDICATION_MODE = value.toFixed(0);
    this.needsUpdate = true;
  }
  /**
   * Returns the predication mode.
   *
   * @deprecated Use predicationMode instead.
   * @return {PredicationMode} The mode.
   */
  getPredicationMode() {
    return this.predicationMode;
  }
  /**
   * Sets the predication mode.
   *
   * @deprecated Use predicationMode instead.
   * @param {PredicationMode} value - The predication mode.
   */
  setPredicationMode(value) {
    this.predicationMode = value;
  }
  /**
   * The predication buffer.
   *
   * @type {Texture}
   */
  set predicationBuffer(value) {
    this.uniforms.predicationBuffer.value = value;
  }
  /**
   * Sets a custom predication buffer.
   *
   * @deprecated Use predicationBuffer instead.
   * @param {Texture} value - The predication buffer.
   */
  setPredicationBuffer(value) {
    this.uniforms.predicationBuffer.value = value;
  }
  /**
   * The predication threshold.
   *
   * @type {Number}
   */
  get predicationThreshold() {
    return Number(this.defines.PREDICATION_THRESHOLD);
  }
  set predicationThreshold(value) {
    this.defines.PREDICATION_THRESHOLD = value.toFixed("6");
    this.needsUpdate = true;
  }
  /**
   * Returns the predication threshold.
   *
   * @deprecated Use predicationThreshold instead.
   * @return {Number} The threshold.
   */
  getPredicationThreshold() {
    return this.predicationThreshold;
  }
  /**
   * Sets the predication threshold.
   *
   * @deprecated Use predicationThreshold instead.
   * @param {Number} value - The threshold.
   */
  setPredicationThreshold(value) {
    this.predicationThreshold = value;
  }
  /**
   * The predication scale. Range: [1.0, 5.0].
   *
   * Determines how much the edge detection threshold should be scaled when using predication.
   *
   * @type {Boolean|Texture|Number}
   */
  get predicationScale() {
    return Number(this.defines.PREDICATION_SCALE);
  }
  set predicationScale(value) {
    this.defines.PREDICATION_SCALE = value.toFixed("6");
    this.needsUpdate = true;
  }
  /**
   * Returns the predication scale.
   *
   * @deprecated Use predicationScale instead.
   * @return {Number} The scale.
   */
  getPredicationScale() {
    return this.predicationScale;
  }
  /**
   * Sets the predication scale.
   *
   * @deprecated Use predicationScale instead.
   * @param {Number} value - The scale. Range: [1.0, 5.0].
   */
  setPredicationScale(value) {
    this.predicationScale = value;
  }
  /**
   * The predication strength. Range: [0.0, 1.0].
   *
   * Determines how much the edge detection threshold should be decreased locally when using predication.
   *
   * @type {Number}
   */
  get predicationStrength() {
    return Number(this.defines.PREDICATION_STRENGTH);
  }
  set predicationStrength(value) {
    this.defines.PREDICATION_STRENGTH = value.toFixed("6");
    this.needsUpdate = true;
  }
  /**
   * Returns the predication strength.
   *
   * @deprecated Use predicationStrength instead.
   * @return {Number} The strength.
   */
  getPredicationStrength() {
    return this.predicationStrength;
  }
  /**
   * Sets the predication strength.
   *
   * @deprecated Use predicationStrength instead.
   * @param {Number} value - The strength. Range: [0.0, 1.0].
   */
  setPredicationStrength(value) {
    this.predicationStrength = value;
  }
  /**
   * Sets the size of this object.
   *
   * @param {Number} width - The width.
   * @param {Number} height - The height.
   */
  setSize(width, height) {
    this.uniforms.texelSize.value.set(1 / width, 1 / height);
  }
};
var smaa_weights_default = `#define sampleLevelZeroOffset(t, coord, offset) texture2D(t, coord + offset * texelSize)
#if __VERSION__ < 300
#define round(v) floor(v + 0.5)
#endif
#ifdef FRAMEBUFFER_PRECISION_HIGH
uniform mediump sampler2D inputBuffer;
#else
uniform lowp sampler2D inputBuffer;
#endif
uniform lowp sampler2D areaTexture;uniform lowp sampler2D searchTexture;uniform vec2 texelSize;uniform vec2 resolution;varying vec2 vUv;varying vec4 vOffset[3];varying vec2 vPixCoord;void movec(const in bvec2 c,inout vec2 variable,const in vec2 value){if(c.x){variable.x=value.x;}if(c.y){variable.y=value.y;}}void movec(const in bvec4 c,inout vec4 variable,const in vec4 value){movec(c.xy,variable.xy,value.xy);movec(c.zw,variable.zw,value.zw);}vec2 decodeDiagBilinearAccess(in vec2 e){e.r=e.r*abs(5.0*e.r-5.0*0.75);return round(e);}vec4 decodeDiagBilinearAccess(in vec4 e){e.rb=e.rb*abs(5.0*e.rb-5.0*0.75);return round(e);}vec2 searchDiag1(const in vec2 texCoord,const in vec2 dir,out vec2 e){vec4 coord=vec4(texCoord,-1.0,1.0);vec3 t=vec3(texelSize,1.0);for(int i=0;i<MAX_SEARCH_STEPS_INT;++i){if(!(coord.z<float(MAX_SEARCH_STEPS_DIAG_INT-1)&&coord.w>0.9)){break;}coord.xyz=t*vec3(dir,1.0)+coord.xyz;e=texture2D(inputBuffer,coord.xy).rg;coord.w=dot(e,vec2(0.5));}return coord.zw;}vec2 searchDiag2(const in vec2 texCoord,const in vec2 dir,out vec2 e){vec4 coord=vec4(texCoord,-1.0,1.0);coord.x+=0.25*texelSize.x;vec3 t=vec3(texelSize,1.0);for(int i=0;i<MAX_SEARCH_STEPS_INT;++i){if(!(coord.z<float(MAX_SEARCH_STEPS_DIAG_INT-1)&&coord.w>0.9)){break;}coord.xyz=t*vec3(dir,1.0)+coord.xyz;e=texture2D(inputBuffer,coord.xy).rg;e=decodeDiagBilinearAccess(e);coord.w=dot(e,vec2(0.5));}return coord.zw;}vec2 areaDiag(const in vec2 dist,const in vec2 e,const in float offset){vec2 texCoord=vec2(AREATEX_MAX_DISTANCE_DIAG,AREATEX_MAX_DISTANCE_DIAG)*e+dist;texCoord=AREATEX_PIXEL_SIZE*texCoord+0.5*AREATEX_PIXEL_SIZE;texCoord.x+=0.5;texCoord.y+=AREATEX_SUBTEX_SIZE*offset;return texture2D(areaTexture,texCoord).rg;}vec2 calculateDiagWeights(const in vec2 texCoord,const in vec2 e,const in vec4 subsampleIndices){vec2 weights=vec2(0.0);vec4 d;vec2 end;if(e.r>0.0){d.xz=searchDiag1(texCoord,vec2(-1.0,1.0),end);d.x+=float(end.y>0.9);}else{d.xz=vec2(0.0);}d.yw=searchDiag1(texCoord,vec2(1.0,-1.0),end);if(d.x+d.y>2.0){vec4 coords=vec4(-d.x+0.25,d.x,d.y,-d.y-0.25)*texelSize.xyxy+texCoord.xyxy;vec4 c;c.xy=sampleLevelZeroOffset(inputBuffer,coords.xy,vec2(-1,0)).rg;c.zw=sampleLevelZeroOffset(inputBuffer,coords.zw,vec2(1,0)).rg;c.yxwz=decodeDiagBilinearAccess(c.xyzw);vec2 cc=vec2(2.0)*c.xz+c.yw;movec(bvec2(step(0.9,d.zw)),cc,vec2(0.0));weights+=areaDiag(d.xy,cc,subsampleIndices.z);}d.xz=searchDiag2(texCoord,vec2(-1.0,-1.0),end);if(sampleLevelZeroOffset(inputBuffer,texCoord,vec2(1,0)).r>0.0){d.yw=searchDiag2(texCoord,vec2(1.0),end);d.y+=float(end.y>0.9);}else{d.yw=vec2(0.0);}if(d.x+d.y>2.0){vec4 coords=vec4(-d.x,-d.x,d.y,d.y)*texelSize.xyxy+texCoord.xyxy;vec4 c;c.x=sampleLevelZeroOffset(inputBuffer,coords.xy,vec2(-1,0)).g;c.y=sampleLevelZeroOffset(inputBuffer,coords.xy,vec2(0,-1)).r;c.zw=sampleLevelZeroOffset(inputBuffer,coords.zw,vec2(1,0)).gr;vec2 cc=vec2(2.0)*c.xz+c.yw;movec(bvec2(step(0.9,d.zw)),cc,vec2(0.0));weights+=areaDiag(d.xy,cc,subsampleIndices.w).gr;}return weights;}float searchLength(const in vec2 e,const in float offset){vec2 scale=SEARCHTEX_SIZE*vec2(0.5,-1.0);vec2 bias=SEARCHTEX_SIZE*vec2(offset,1.0);scale+=vec2(-1.0,1.0);bias+=vec2(0.5,-0.5);scale*=1.0/SEARCHTEX_PACKED_SIZE;bias*=1.0/SEARCHTEX_PACKED_SIZE;return texture2D(searchTexture,scale*e+bias).r;}float searchXLeft(in vec2 texCoord,const in float end){vec2 e=vec2(0.0,1.0);for(int i=0;i<MAX_SEARCH_STEPS_INT;++i){if(!(texCoord.x>end&&e.g>0.8281&&e.r==0.0)){break;}e=texture2D(inputBuffer,texCoord).rg;texCoord=vec2(-2.0,0.0)*texelSize+texCoord;}float offset=-(255.0/127.0)*searchLength(e,0.0)+3.25;return texelSize.x*offset+texCoord.x;}float searchXRight(vec2 texCoord,const in float end){vec2 e=vec2(0.0,1.0);for(int i=0;i<MAX_SEARCH_STEPS_INT;++i){if(!(texCoord.x<end&&e.g>0.8281&&e.r==0.0)){break;}e=texture2D(inputBuffer,texCoord).rg;texCoord=vec2(2.0,0.0)*texelSize.xy+texCoord;}float offset=-(255.0/127.0)*searchLength(e,0.5)+3.25;return-texelSize.x*offset+texCoord.x;}float searchYUp(vec2 texCoord,const in float end){vec2 e=vec2(1.0,0.0);for(int i=0;i<MAX_SEARCH_STEPS_INT;++i){if(!(texCoord.y>end&&e.r>0.8281&&e.g==0.0)){break;}e=texture2D(inputBuffer,texCoord).rg;texCoord=-vec2(0.0,2.0)*texelSize.xy+texCoord;}float offset=-(255.0/127.0)*searchLength(e.gr,0.0)+3.25;return texelSize.y*offset+texCoord.y;}float searchYDown(vec2 texCoord,const in float end){vec2 e=vec2(1.0,0.0);for(int i=0;i<MAX_SEARCH_STEPS_INT;i++){if(!(texCoord.y<end&&e.r>0.8281&&e.g==0.0)){break;}e=texture2D(inputBuffer,texCoord).rg;texCoord=vec2(0.0,2.0)*texelSize.xy+texCoord;}float offset=-(255.0/127.0)*searchLength(e.gr,0.5)+3.25;return-texelSize.y*offset+texCoord.y;}vec2 area(const in vec2 dist,const in float e1,const in float e2,const in float offset){vec2 texCoord=vec2(AREATEX_MAX_DISTANCE)*round(4.0*vec2(e1,e2))+dist;texCoord=AREATEX_PIXEL_SIZE*texCoord+0.5*AREATEX_PIXEL_SIZE;texCoord.y=AREATEX_SUBTEX_SIZE*offset+texCoord.y;return texture2D(areaTexture,texCoord).rg;}void detectHorizontalCornerPattern(inout vec2 weights,const in vec4 texCoord,const in vec2 d){
#if !defined(DISABLE_CORNER_DETECTION)
vec2 leftRight=step(d.xy,d.yx);vec2 rounding=(1.0-CORNER_ROUNDING_NORM)*leftRight;rounding/=leftRight.x+leftRight.y;vec2 factor=vec2(1.0);factor.x-=rounding.x*sampleLevelZeroOffset(inputBuffer,texCoord.xy,vec2(0,1)).r;factor.x-=rounding.y*sampleLevelZeroOffset(inputBuffer,texCoord.zw,vec2(1,1)).r;factor.y-=rounding.x*sampleLevelZeroOffset(inputBuffer,texCoord.xy,vec2(0,-2)).r;factor.y-=rounding.y*sampleLevelZeroOffset(inputBuffer,texCoord.zw,vec2(1,-2)).r;weights*=clamp(factor,0.0,1.0);
#endif
}void detectVerticalCornerPattern(inout vec2 weights,const in vec4 texCoord,const in vec2 d){
#if !defined(DISABLE_CORNER_DETECTION)
vec2 leftRight=step(d.xy,d.yx);vec2 rounding=(1.0-CORNER_ROUNDING_NORM)*leftRight;rounding/=leftRight.x+leftRight.y;vec2 factor=vec2(1.0);factor.x-=rounding.x*sampleLevelZeroOffset(inputBuffer,texCoord.xy,vec2(1,0)).g;factor.x-=rounding.y*sampleLevelZeroOffset(inputBuffer,texCoord.zw,vec2(1,1)).g;factor.y-=rounding.x*sampleLevelZeroOffset(inputBuffer,texCoord.xy,vec2(-2,0)).g;factor.y-=rounding.y*sampleLevelZeroOffset(inputBuffer,texCoord.zw,vec2(-2,1)).g;weights*=clamp(factor,0.0,1.0);
#endif
}void main(){vec4 weights=vec4(0.0);vec4 subsampleIndices=vec4(0.0);vec2 e=texture2D(inputBuffer,vUv).rg;if(e.g>0.0){
#if !defined(DISABLE_DIAG_DETECTION)
weights.rg=calculateDiagWeights(vUv,e,subsampleIndices);if(weights.r==-weights.g){
#endif
vec2 d;vec3 coords;coords.x=searchXLeft(vOffset[0].xy,vOffset[2].x);coords.y=vOffset[1].y;d.x=coords.x;float e1=texture2D(inputBuffer,coords.xy).r;coords.z=searchXRight(vOffset[0].zw,vOffset[2].y);d.y=coords.z;d=round(resolution.xx*d+-vPixCoord.xx);vec2 sqrtD=sqrt(abs(d));float e2=sampleLevelZeroOffset(inputBuffer,coords.zy,vec2(1,0)).r;weights.rg=area(sqrtD,e1,e2,subsampleIndices.y);coords.y=vUv.y;detectHorizontalCornerPattern(weights.rg,coords.xyzy,d);
#if !defined(DISABLE_DIAG_DETECTION)
}else{e.r=0.0;}
#endif
}if(e.r>0.0){vec2 d;vec3 coords;coords.y=searchYUp(vOffset[1].xy,vOffset[2].z);coords.x=vOffset[0].x;d.x=coords.y;float e1=texture2D(inputBuffer,coords.xy).g;coords.z=searchYDown(vOffset[1].zw,vOffset[2].w);d.y=coords.z;d=round(resolution.yy*d-vPixCoord.yy);vec2 sqrtD=sqrt(abs(d));float e2=sampleLevelZeroOffset(inputBuffer,coords.xz,vec2(0,1)).g;weights.ba=area(sqrtD,e1,e2,subsampleIndices.x);coords.x=vUv.x;detectVerticalCornerPattern(weights.ba,coords.xyxz,d);}gl_FragColor=weights;}`;
var smaa_weights_default2 = `uniform vec2 texelSize;uniform vec2 resolution;varying vec2 vUv;varying vec4 vOffset[3];varying vec2 vPixCoord;void main(){vUv=position.xy*0.5+0.5;vPixCoord=vUv*resolution;vOffset[0]=vUv.xyxy+texelSize.xyxy*vec4(-0.25,-0.125,1.25,-0.125);vOffset[1]=vUv.xyxy+texelSize.xyxy*vec4(-0.125,-0.25,-0.125,1.25);vOffset[2]=vec4(vOffset[0].xz,vOffset[1].yw)+vec4(-2.0,2.0,-2.0,2.0)*texelSize.xxyy*MAX_SEARCH_STEPS_FLOAT;gl_Position=vec4(position.xy,1.0,1.0);}`;
var SMAAWeightsMaterial = class extends ShaderMaterial {
  /**
   * Constructs a new SMAA weights material.
   *
   * @param {Vector2} [texelSize] - The absolute screen texel size.
   * @param {Vector2} [resolution] - The resolution.
   */
  constructor(texelSize = new Vector2(), resolution = new Vector2()) {
    super({
      name: "SMAAWeightsMaterial",
      defines: {
        // Configurable settings:
        MAX_SEARCH_STEPS_INT: "16",
        MAX_SEARCH_STEPS_FLOAT: "16.0",
        MAX_SEARCH_STEPS_DIAG_INT: "8",
        MAX_SEARCH_STEPS_DIAG_FLOAT: "8.0",
        CORNER_ROUNDING: "25",
        CORNER_ROUNDING_NORM: "0.25",
        // Non-configurable settings:
        AREATEX_MAX_DISTANCE: "16.0",
        AREATEX_MAX_DISTANCE_DIAG: "20.0",
        AREATEX_PIXEL_SIZE: "(1.0 / vec2(160.0, 560.0))",
        AREATEX_SUBTEX_SIZE: "(1.0 / 7.0)",
        SEARCHTEX_SIZE: "vec2(66.0, 33.0)",
        SEARCHTEX_PACKED_SIZE: "vec2(64.0, 16.0)"
      },
      uniforms: {
        inputBuffer: new Uniform(null),
        searchTexture: new Uniform(null),
        areaTexture: new Uniform(null),
        resolution: new Uniform(resolution),
        texelSize: new Uniform(texelSize)
      },
      blending: NoBlending,
      toneMapped: false,
      depthWrite: false,
      depthTest: false,
      fragmentShader: smaa_weights_default,
      vertexShader: smaa_weights_default2
    });
  }
  /**
   * The input buffer.
   *
   * @type {Texture}
   */
  set inputBuffer(value) {
    this.uniforms.inputBuffer.value = value;
  }
  /**
   * Sets the input buffer.
   *
   * @deprecated Use inputBuffer instead.
   * @param {Texture} value - The input buffer.
   */
  setInputBuffer(value) {
    this.uniforms.inputBuffer.value = value;
  }
  /**
   * The search lookup texture.
   *
   * @type {Texture}
   */
  get searchTexture() {
    return this.uniforms.searchTexture.value;
  }
  set searchTexture(value) {
    this.uniforms.searchTexture.value = value;
  }
  /**
   * The area lookup texture.
   *
   * @type {Texture}
   */
  get areaTexture() {
    return this.uniforms.areaTexture.value;
  }
  set areaTexture(value) {
    this.uniforms.areaTexture.value = value;
  }
  /**
   * Sets the search and area lookup textures.
   *
   * @deprecated Use searchTexture and areaTexture instead.
   * @param {Texture} search - The search lookup texture.
   * @param {Texture} area - The area lookup texture.
   */
  setLookupTextures(search, area2) {
    this.searchTexture = search;
    this.areaTexture = area2;
  }
  /**
   * The maximum amount of steps performed in the horizontal/vertical pattern searches, at each side of the pixel.
   * Range: [0, 112].
   *
   * In number of pixels, it's actually the double. So the maximum line length perfectly handled by, for example 16, is
   * 64 (perfectly means that longer lines won't look as good, but are still antialiased).
   *
   * @type {Number}
   */
  get orthogonalSearchSteps() {
    return Number(this.defines.MAX_SEARCH_STEPS_INT);
  }
  set orthogonalSearchSteps(value) {
    const s = Math.min(Math.max(value, 0), 112);
    this.defines.MAX_SEARCH_STEPS_INT = s.toFixed("0");
    this.defines.MAX_SEARCH_STEPS_FLOAT = s.toFixed("1");
    this.needsUpdate = true;
  }
  /**
   * Sets the maximum amount of steps performed in the horizontal/vertical pattern searches, at each side of the pixel.
   *
   * @deprecated Use orthogonalSearchSteps instead.
   * @param {Number} value - The search steps. Range: [0, 112].
   */
  setOrthogonalSearchSteps(value) {
    this.orthogonalSearchSteps = value;
  }
  /**
   * The maximum steps performed in the diagonal pattern searches, at each side of the pixel. This search
   * jumps one pixel at a time. Range: [0, 20].
   *
   * On high-end machines this search is cheap (between 0.8x and 0.9x slower for 16 steps), but it can have a
   * significant impact on older machines.
   *
   * @type {Number}
   */
  get diagonalSearchSteps() {
    return Number(this.defines.MAX_SEARCH_STEPS_DIAG_INT);
  }
  set diagonalSearchSteps(value) {
    const s = Math.min(Math.max(value, 0), 20);
    this.defines.MAX_SEARCH_STEPS_DIAG_INT = s.toFixed("0");
    this.defines.MAX_SEARCH_STEPS_DIAG_FLOAT = s.toFixed("1");
    this.needsUpdate = true;
  }
  /**
   * Specifies the maximum steps performed in the diagonal pattern searches, at each side of the pixel.
   *
   * @deprecated Use diagonalSearchSteps instead.
   * @param {Number} value - The search steps. Range: [0, 20].
   */
  setDiagonalSearchSteps(value) {
    this.diagonalSearchSteps = value;
  }
  /**
   * Indicates whether diagonal pattern detection is enabled.
   *
   * @type {Boolean}
   */
  get diagonalDetection() {
    return this.defines.DISABLE_DIAG_DETECTION === void 0;
  }
  set diagonalDetection(value) {
    if (value) {
      delete this.defines.DISABLE_DIAG_DETECTION;
    } else {
      this.defines.DISABLE_DIAG_DETECTION = "1";
    }
    this.needsUpdate = true;
  }
  /**
   * Indicates whether diagonal pattern detection is enabled.
   *
   * @deprecated Use diagonalDetection instead.
   * @return {Boolean} Whether diagonal pattern detection is enabled.
   */
  isDiagonalDetectionEnabled() {
    return this.diagonalDetection;
  }
  /**
   * Enables or disables diagonal pattern detection.
   *
   * @deprecated Use diagonalDetection instead.
   * @param {Boolean} value - Whether diagonal pattern detection should be enabled.
   */
  setDiagonalDetectionEnabled(value) {
    this.diagonalDetection = value;
  }
  /**
   * Specifies how much sharp corners will be rounded. Range: [0, 100].
   *
   * @type {Number}
   */
  get cornerRounding() {
    return Number(this.defines.CORNER_ROUNDING);
  }
  set cornerRounding(value) {
    const r = Math.min(Math.max(value, 0), 100);
    this.defines.CORNER_ROUNDING = r.toFixed("4");
    this.defines.CORNER_ROUNDING_NORM = (r / 100).toFixed("4");
    this.needsUpdate = true;
  }
  /**
   * Specifies how much sharp corners will be rounded.
   *
   * @deprecated Use cornerRounding instead.
   * @param {Number} value - The corner rounding amount. Range: [0, 100].
   */
  setCornerRounding(value) {
    this.cornerRounding = value;
  }
  /**
   * Indicates whether corner detection is enabled.
   *
   * @type {Number}
   */
  get cornerDetection() {
    return this.defines.DISABLE_CORNER_DETECTION === void 0;
  }
  set cornerDetection(value) {
    if (value) {
      delete this.defines.DISABLE_CORNER_DETECTION;
    } else {
      this.defines.DISABLE_CORNER_DETECTION = "1";
    }
    this.needsUpdate = true;
  }
  /**
   * Indicates whether corner rounding is enabled.
   *
   * @deprecated Use cornerDetection instead.
   * @return {Boolean} Whether corner rounding is enabled.
   */
  isCornerRoundingEnabled() {
    return this.cornerDetection;
  }
  /**
   * Enables or disables corner rounding.
   *
   * @deprecated Use cornerDetection instead.
   * @param {Boolean} value - Whether corner rounding should be enabled.
   */
  setCornerRoundingEnabled(value) {
    this.cornerDetection = value;
  }
  /**
   * Sets the size of this object.
   *
   * @param {Number} width - The width.
   * @param {Number} height - The height.
   */
  setSize(width, height) {
    const uniforms = this.uniforms;
    uniforms.texelSize.value.set(1 / width, 1 / height);
    uniforms.resolution.value.set(width, height);
  }
};
var searchImageDataURL_default = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAAAQCAYAAACm53kpAAAAeElEQVRYR+2XSwqAMAxEJ168ePEqwRSKhIIiuHjJqiU0gWE+1CQdApcVAMUAuARaMGCX1MIL/Ow13++9lW2s3mW9MWvsnWc/2fvGygwPAN4E8QzAA4CXAB6AHjG4JTHYI1ey3pcx6FHnEfhLDOIBKAmUBK6/ANUDTlROXAHd9EC1AAAAAElFTkSuQmCC";
var areaImageDataURL_default = "data:image/png;base64,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";
var smaa_default = `uniform sampler2D weightMap;varying vec2 vOffset0;varying vec2 vOffset1;void movec(const in bvec2 c,inout vec2 variable,const in vec2 value){if(c.x){variable.x=value.x;}if(c.y){variable.y=value.y;}}void movec(const in bvec4 c,inout vec4 variable,const in vec4 value){movec(c.xy,variable.xy,value.xy);movec(c.zw,variable.zw,value.zw);}void mainImage(const in vec4 inputColor,const in vec2 uv,out vec4 outputColor){vec4 a;a.x=texture2D(weightMap,vOffset0).a;a.y=texture2D(weightMap,vOffset1).g;a.wz=texture2D(weightMap,uv).rb;vec4 color=inputColor;if(dot(a,vec4(1.0))>=1e-5){bool h=max(a.x,a.z)>max(a.y,a.w);vec4 blendingOffset=vec4(0.0,a.y,0.0,a.w);vec2 blendingWeight=a.yw;movec(bvec4(h),blendingOffset,vec4(a.x,0.0,a.z,0.0));movec(bvec2(h),blendingWeight,a.xz);blendingWeight/=dot(blendingWeight,vec2(1.0));vec4 blendingCoord=blendingOffset*vec4(texelSize,-texelSize)+uv.xyxy;color=blendingWeight.x*texture2D(inputBuffer,blendingCoord.xy);color+=blendingWeight.y*texture2D(inputBuffer,blendingCoord.zw);}outputColor=color;}`;
var smaa_default2 = `varying vec2 vOffset0;varying vec2 vOffset1;void mainSupport(const in vec2 uv){vOffset0=uv+texelSize*vec2(1.0,0.0);vOffset1=uv+texelSize*vec2(0.0,1.0);}`;
var SMAAEffect = class extends Effect {
  /**
   * Constructs a new SMAA effect.
   *
   * @param {Object} [options] - The options.
   * @param {BlendFunction} [options.blendFunction=BlendFunction.SRC] - The blend function of this effect.
   * @param {SMAAPreset} [options.preset=SMAAPreset.MEDIUM] - The quality preset.
   * @param {EdgeDetectionMode} [options.edgeDetectionMode=EdgeDetectionMode.COLOR] - The edge detection mode.
   * @param {PredicationMode} [options.predicationMode=PredicationMode.DISABLED] - The predication mode.
   */
  constructor({
    blendFunction = BlendFunction.SRC,
    preset = SMAAPreset.MEDIUM,
    edgeDetectionMode = EdgeDetectionMode.COLOR,
    predicationMode = PredicationMode.DISABLED
  } = {}) {
    super("SMAAEffect", smaa_default, {
      vertexShader: smaa_default2,
      blendFunction,
      attributes: EffectAttribute.CONVOLUTION | EffectAttribute.DEPTH,
      uniforms: /* @__PURE__ */ new Map([
        ["weightMap", new Uniform(null)]
      ])
    });
    let searchImage, areaImage;
    if (arguments.length > 1) {
      searchImage = arguments[0];
      areaImage = arguments[1];
      if (arguments.length > 2) {
        preset = arguments[2];
      }
      if (arguments.length > 3) {
        edgeDetectionMode = arguments[3];
      }
    }
    this.renderTargetEdges = new WebGLRenderTarget(1, 1, { depthBuffer: false });
    this.renderTargetEdges.texture.name = "SMAA.Edges";
    this.renderTargetWeights = this.renderTargetEdges.clone();
    this.renderTargetWeights.texture.name = "SMAA.Weights";
    this.uniforms.get("weightMap").value = this.renderTargetWeights.texture;
    this.clearPass = new ClearPass(true, false, false);
    this.clearPass.overrideClearColor = new Color(0);
    this.clearPass.overrideClearAlpha = 1;
    this.edgeDetectionPass = new ShaderPass(new EdgeDetectionMaterial());
    this.edgeDetectionMaterial.edgeDetectionMode = edgeDetectionMode;
    this.edgeDetectionMaterial.predicationMode = predicationMode;
    this.weightsPass = new ShaderPass(new SMAAWeightsMaterial());
    const loadingManager = new LoadingManager();
    loadingManager.onLoad = () => {
      const searchTexture = new Texture(searchImage);
      searchTexture.name = "SMAA.Search";
      searchTexture.magFilter = NearestFilter;
      searchTexture.minFilter = NearestFilter;
      searchTexture.generateMipmaps = false;
      searchTexture.needsUpdate = true;
      searchTexture.flipY = true;
      this.weightsMaterial.searchTexture = searchTexture;
      const areaTexture = new Texture(areaImage);
      areaTexture.name = "SMAA.Area";
      areaTexture.magFilter = LinearFilter;
      areaTexture.minFilter = LinearFilter;
      areaTexture.generateMipmaps = false;
      areaTexture.needsUpdate = true;
      areaTexture.flipY = false;
      this.weightsMaterial.areaTexture = areaTexture;
      this.dispatchEvent({ type: "load" });
    };
    loadingManager.itemStart("search");
    loadingManager.itemStart("area");
    if (searchImage !== void 0 && areaImage !== void 0) {
      loadingManager.itemEnd("search");
      loadingManager.itemEnd("area");
    } else if (typeof Image !== "undefined") {
      searchImage = new Image();
      areaImage = new Image();
      searchImage.addEventListener("load", () => loadingManager.itemEnd("search"));
      areaImage.addEventListener("load", () => loadingManager.itemEnd("area"));
      searchImage.src = searchImageDataURL_default;
      areaImage.src = areaImageDataURL_default;
    }
    this.applyPreset(preset);
  }
  /**
   * The edges texture.
   *
   * @type {Texture}
   */
  get edgesTexture() {
    return this.renderTargetEdges.texture;
  }
  /**
   * Returns the edges texture.
   *
   * @deprecated Use edgesTexture instead.
   * @return {Texture} The texture.
   */
  getEdgesTexture() {
    return this.edgesTexture;
  }
  /**
   * The edge weights texture.
   *
   * @type {Texture}
   */
  get weightsTexture() {
    return this.renderTargetWeights.texture;
  }
  /**
   * Returns the edge weights texture.
   *
   * @deprecated Use weightsTexture instead.
   * @return {Texture} The texture.
   */
  getWeightsTexture() {
    return this.weightsTexture;
  }
  /**
   * The edge detection material.
   *
   * @type {EdgeDetectionMaterial}
   */
  get edgeDetectionMaterial() {
    return this.edgeDetectionPass.fullscreenMaterial;
  }
  /**
   * The edge detection material.
   *
   * @type {EdgeDetectionMaterial}
   * @deprecated Use edgeDetectionMaterial instead.
   */
  get colorEdgesMaterial() {
    return this.edgeDetectionMaterial;
  }
  /**
   * Returns the edge detection material.
   *
   * @deprecated Use edgeDetectionMaterial instead.
   * @return {EdgeDetectionMaterial} The material.
   */
  getEdgeDetectionMaterial() {
    return this.edgeDetectionMaterial;
  }
  /**
   * The edge weights material.
   *
   * @type {SMAAWeightsMaterial}
   */
  get weightsMaterial() {
    return this.weightsPass.fullscreenMaterial;
  }
  /**
   * Returns the edge weights material.
   *
   * @deprecated Use weightsMaterial instead.
   * @return {SMAAWeightsMaterial} The material.
   */
  getWeightsMaterial() {
    return this.weightsMaterial;
  }
  /**
   * Sets the edge detection sensitivity.
   *
   * See {@link EdgeDetectionMaterial#setEdgeDetectionThreshold} for more details.
   *
   * @deprecated Use edgeDetectionMaterial instead.
   * @param {Number} threshold - The edge detection sensitivity. Range: [0.05, 0.5].
   */
  setEdgeDetectionThreshold(threshold) {
    this.edgeDetectionMaterial.edgeDetectionThreshold = threshold;
  }
  /**
   * Sets the maximum amount of horizontal/vertical search steps.
   *
   * See {@link SMAAWeightsMaterial#setOrthogonalSearchSteps} for more details.
   *
   * @deprecated Use weightsMaterial instead.
   * @param {Number} steps - The search steps. Range: [0, 112].
   */
  setOrthogonalSearchSteps(steps) {
    this.weightsMaterial.orthogonalSearchSteps = steps;
  }
  /**
   * Applies the given quality preset.
   *
   * @param {SMAAPreset} preset - The preset.
   */
  applyPreset(preset) {
    const edgeDetectionMaterial = this.edgeDetectionMaterial;
    const weightsMaterial = this.weightsMaterial;
    switch (preset) {
      case SMAAPreset.LOW:
        edgeDetectionMaterial.edgeDetectionThreshold = 0.15;
        weightsMaterial.orthogonalSearchSteps = 4;
        weightsMaterial.diagonalDetection = false;
        weightsMaterial.cornerDetection = false;
        break;
      case SMAAPreset.MEDIUM:
        edgeDetectionMaterial.edgeDetectionThreshold = 0.1;
        weightsMaterial.orthogonalSearchSteps = 8;
        weightsMaterial.diagonalDetection = false;
        weightsMaterial.cornerDetection = false;
        break;
      case SMAAPreset.HIGH:
        edgeDetectionMaterial.edgeDetectionThreshold = 0.1;
        weightsMaterial.orthogonalSearchSteps = 16;
        weightsMaterial.diagonalSearchSteps = 8;
        weightsMaterial.cornerRounding = 25;
        weightsMaterial.diagonalDetection = true;
        weightsMaterial.cornerDetection = true;
        break;
      case SMAAPreset.ULTRA:
        edgeDetectionMaterial.edgeDetectionThreshold = 0.05;
        weightsMaterial.orthogonalSearchSteps = 32;
        weightsMaterial.diagonalSearchSteps = 16;
        weightsMaterial.cornerRounding = 25;
        weightsMaterial.diagonalDetection = true;
        weightsMaterial.cornerDetection = true;
        break;
    }
  }
  /**
   * Sets the depth texture.
   *
   * @param {Texture} depthTexture - A depth texture.
   * @param {DepthPackingStrategies} [depthPacking=BasicDepthPacking] - The depth packing.
   */
  setDepthTexture(depthTexture, depthPacking = BasicDepthPacking) {
    this.edgeDetectionMaterial.depthBuffer = depthTexture;
    this.edgeDetectionMaterial.depthPacking = depthPacking;
  }
  /**
   * Updates this effect.
   *
   * @param {WebGLRenderer} renderer - The renderer.
   * @param {WebGLRenderTarget} inputBuffer - A frame buffer that contains the result of the previous pass.
   * @param {Number} [deltaTime] - The time between the last frame and the current one in seconds.
   */
  update(renderer, inputBuffer, deltaTime) {
    this.clearPass.render(renderer, this.renderTargetEdges);
    this.edgeDetectionPass.render(renderer, inputBuffer, this.renderTargetEdges);
    this.weightsPass.render(renderer, this.renderTargetEdges, this.renderTargetWeights);
  }
  /**
   * Updates the size of internal render targets.
   *
   * @param {Number} width - The width.
   * @param {Number} height - The height.
   */
  setSize(width, height) {
    this.edgeDetectionMaterial.setSize(width, height);
    this.weightsMaterial.setSize(width, height);
    this.renderTargetEdges.setSize(width, height);
    this.renderTargetWeights.setSize(width, height);
  }
  /**
   * Deletes internal render targets and textures.
   */
  dispose() {
    const { searchTexture, areaTexture } = this.weightsMaterial;
    if (searchTexture !== null && areaTexture !== null) {
      searchTexture.dispose();
      areaTexture.dispose();
    }
    super.dispose();
  }
  /**
   * The SMAA search image, encoded as a base64 data URL.
   *
   * @type {String}
   * @deprecated
   */
  static get searchImageDataURL() {
    return searchImageDataURL_default;
  }
  /**
   * The SMAA area image, encoded as a base64 data URL.
   *
   * @type {String}
   * @deprecated
   */
  static get areaImageDataURL() {
    return areaImageDataURL_default;
  }
};
var ssao_default = `#include <common>
#include <packing>
#ifdef NORMAL_DEPTH
#ifdef GL_FRAGMENT_PRECISION_HIGH
uniform highp sampler2D normalDepthBuffer;
#else
uniform mediump sampler2D normalDepthBuffer;
#endif
float readDepth(const in vec2 uv){return texture2D(normalDepthBuffer,uv).a;}
#else
uniform lowp sampler2D normalBuffer;
#if DEPTH_PACKING == 3201
uniform lowp sampler2D depthBuffer;
#elif defined(GL_FRAGMENT_PRECISION_HIGH)
uniform highp sampler2D depthBuffer;
#else
uniform mediump sampler2D depthBuffer;
#endif
float readDepth(const in vec2 uv){
#if DEPTH_PACKING == 3201
return unpackRGBAToDepth(texture2D(depthBuffer,uv));
#else
return texture2D(depthBuffer,uv).r;
#endif
}
#endif
uniform lowp sampler2D noiseTexture;uniform mat4 inverseProjectionMatrix;uniform mat4 projectionMatrix;uniform vec2 texelSize;uniform vec2 cameraNearFar;uniform float intensity;uniform float minRadiusScale;uniform float fade;uniform float bias;uniform vec2 distanceCutoff;uniform vec2 proximityCutoff;varying vec2 vUv;varying vec2 vUv2;float getViewZ(const in float depth){
#ifdef PERSPECTIVE_CAMERA
return perspectiveDepthToViewZ(depth,cameraNearFar.x,cameraNearFar.y);
#else
return orthographicDepthToViewZ(depth,cameraNearFar.x,cameraNearFar.y);
#endif
}vec3 getViewPosition(const in vec2 screenPosition,const in float depth,const in float viewZ){vec4 clipPosition=vec4(vec3(screenPosition,depth)*2.0-1.0,1.0);float clipW=projectionMatrix[2][3]*viewZ+projectionMatrix[3][3];clipPosition*=clipW;return(inverseProjectionMatrix*clipPosition).xyz;}float getAmbientOcclusion(const in vec3 p,const in vec3 n,const in float depth,const in vec2 uv){float radiusScale=1.0-smoothstep(0.0,distanceCutoff.y,depth);radiusScale=radiusScale*(1.0-minRadiusScale)+minRadiusScale;float radius=RADIUS*radiusScale;float noise=texture2D(noiseTexture,vUv2).r;float baseAngle=noise*PI2;float rings=SPIRAL_TURNS*PI2;float occlusion=0.0;int taps=0;for(int i=0;i<SAMPLES_INT;++i){float alpha=(float(i)+0.5)*INV_SAMPLES_FLOAT;float angle=alpha*rings+baseAngle;vec2 rotation=vec2(cos(angle),sin(angle));vec2 coords=alpha*radius*rotation*texelSize+uv;if(coords.s<0.0||coords.s>1.0||coords.t<0.0||coords.t>1.0){continue;}float sampleDepth=readDepth(coords);float viewZ=getViewZ(sampleDepth);
#ifdef PERSPECTIVE_CAMERA
float linearSampleDepth=viewZToOrthographicDepth(viewZ,cameraNearFar.x,cameraNearFar.y);
#else
float linearSampleDepth=sampleDepth;
#endif
float proximity=abs(depth-linearSampleDepth);if(proximity<proximityCutoff.y){float falloff=1.0-smoothstep(proximityCutoff.x,proximityCutoff.y,proximity);vec3 Q=getViewPosition(coords,sampleDepth,viewZ);vec3 v=Q-p;float vv=dot(v,v);float vn=dot(v,n)-bias;float f=max(RADIUS_SQ-vv,0.0)/RADIUS_SQ;occlusion+=(f*f*f*max(vn/(fade+vv),0.0))*falloff;}++taps;}return occlusion/(4.0*max(float(taps),1.0));}void main(){
#ifdef NORMAL_DEPTH
vec4 normalDepth=texture2D(normalDepthBuffer,vUv);
#else
vec4 normalDepth=vec4(texture2D(normalBuffer,vUv).xyz,readDepth(vUv));
#endif
float ao=0.0;float depth=normalDepth.a;float viewZ=getViewZ(depth);
#ifdef PERSPECTIVE_CAMERA
float linearDepth=viewZToOrthographicDepth(viewZ,cameraNearFar.x,cameraNearFar.y);
#else
float linearDepth=depth;
#endif
if(linearDepth<distanceCutoff.y){vec3 viewPosition=getViewPosition(vUv,depth,viewZ);vec3 viewNormal=unpackRGBToNormal(normalDepth.rgb);ao+=getAmbientOcclusion(viewPosition,viewNormal,linearDepth,vUv);float d=smoothstep(distanceCutoff.x,distanceCutoff.y,linearDepth);ao=mix(ao,0.0,d);
#ifdef LEGACY_INTENSITY
ao=clamp(1.0-pow(1.0-ao,abs(intensity)),0.0,1.0);
#endif
}gl_FragColor.r=ao;}`;
var ssao_default2 = `uniform vec2 noiseScale;varying vec2 vUv;varying vec2 vUv2;void main(){vUv=position.xy*0.5+0.5;vUv2=vUv*noiseScale;gl_Position=vec4(position.xy,1.0,1.0);}`;
var SSAOMaterial = class extends ShaderMaterial {
  /**
   * Constructs a new SSAO material.
   *
   * @param {Camera} camera - A camera.
   */
  constructor(camera) {
    super({
      name: "SSAOMaterial",
      defines: {
        SAMPLES_INT: "0",
        INV_SAMPLES_FLOAT: "0.0",
        SPIRAL_TURNS: "0.0",
        RADIUS: "1.0",
        RADIUS_SQ: "1.0",
        DISTANCE_SCALING: "1",
        DEPTH_PACKING: "0"
      },
      uniforms: {
        depthBuffer: new Uniform(null),
        normalBuffer: new Uniform(null),
        normalDepthBuffer: new Uniform(null),
        noiseTexture: new Uniform(null),
        inverseProjectionMatrix: new Uniform(new Matrix4()),
        projectionMatrix: new Uniform(new Matrix4()),
        texelSize: new Uniform(new Vector2()),
        cameraNearFar: new Uniform(new Vector2()),
        distanceCutoff: new Uniform(new Vector2()),
        proximityCutoff: new Uniform(new Vector2()),
        noiseScale: new Uniform(new Vector2()),
        minRadiusScale: new Uniform(0.33),
        intensity: new Uniform(1),
        fade: new Uniform(0.01),
        bias: new Uniform(0)
      },
      blending: NoBlending,
      toneMapped: false,
      depthWrite: false,
      depthTest: false,
      fragmentShader: ssao_default,
      vertexShader: ssao_default2
    });
    this.copyCameraSettings(camera);
    this.resolution = new Vector2();
    this.r = 1;
  }
  /**
   * The current near plane setting.
   *
   * @type {Number}
   * @private
   */
  get near() {
    return this.uniforms.cameraNearFar.value.x;
  }
  /**
   * The current far plane setting.
   *
   * @type {Number}
   * @private
   */
  get far() {
    return this.uniforms.cameraNearFar.value.y;
  }
  /**
   * A combined normal-depth buffer.
   *
   * @type {Texture}
   */
  set normalDepthBuffer(value) {
    this.uniforms.normalDepthBuffer.value = value;
    if (value !== null) {
      this.defines.NORMAL_DEPTH = "1";
    } else {
      delete this.defines.NORMAL_DEPTH;
    }
    this.needsUpdate = true;
  }
  /**
   * Sets the combined normal-depth buffer.
   *
   * @deprecated Use normalDepthBuffer instead.
   * @param {Number} value - The buffer.
   */
  setNormalDepthBuffer(value) {
    this.normalDepthBuffer = value;
  }
  /**
   * The normal buffer.
   *
   * @type {Texture}
   */
  set normalBuffer(value) {
    this.uniforms.normalBuffer.value = value;
  }
  /**
   * Sets the normal buffer.
   *
   * @deprecated Use normalBuffer instead.
   * @param {Number} value - The buffer.
   */
  setNormalBuffer(value) {
    this.uniforms.normalBuffer.value = value;
  }
  /**
   * The depth buffer.
   *
   * @type {Texture}
   */
  set depthBuffer(value) {
    this.uniforms.depthBuffer.value = value;
  }
  /**
   * The depth packing strategy.
   *
   * @type {DepthPackingStrategies}
   */
  set depthPacking(value) {
    this.defines.DEPTH_PACKING = value.toFixed(0);
    this.needsUpdate = true;
  }
  /**
   * Sets the depth buffer.
   *
   * @deprecated Use depthBuffer and depthPacking instead.
   * @param {Texture} buffer - The depth texture.
   * @param {DepthPackingStrategies} [depthPacking=BasicDepthPacking] - The depth packing strategy.
   */
  setDepthBuffer(buffer2, depthPacking = BasicDepthPacking) {
    this.depthBuffer = buffer2;
    this.depthPacking = depthPacking;
  }
  /**
   * The noise texture.
   *
   * @type {Texture}
   */
  set noiseTexture(value) {
    this.uniforms.noiseTexture.value = value;
  }
  /**
   * Sets the noise texture.
   *
   * @deprecated Use noiseTexture instead.
   * @param {Number} value - The texture.
   */
  setNoiseTexture(value) {
    this.uniforms.noiseTexture.value = value;
  }
  /**
   * The sample count.
   *
   * @type {Number}
   */
  get samples() {
    return Number(this.defines.SAMPLES_INT);
  }
  set samples(value) {
    this.defines.SAMPLES_INT = value.toFixed(0);
    this.defines.INV_SAMPLES_FLOAT = (1 / value).toFixed(9);
    this.needsUpdate = true;
  }
  /**
   * Returns the amount of occlusion samples per pixel.
   *
   * @deprecated Use samples instead.
   * @return {Number} The sample count.
   */
  getSamples() {
    return this.samples;
  }
  /**
   * Sets the amount of occlusion samples per pixel.
   *
   * @deprecated Use samples instead.
   * @param {Number} value - The sample count.
   */
  setSamples(value) {
    this.samples = value;
  }
  /**
   * The sampling spiral ring count.
   *
   * @type {Number}
   */
  get rings() {
    return Number(this.defines.SPIRAL_TURNS);
  }
  set rings(value) {
    this.defines.SPIRAL_TURNS = value.toFixed(1);
    this.needsUpdate = true;
  }
  /**
   * Returns the amount of spiral turns in the occlusion sampling pattern.
   *
   * @deprecated Use rings instead.
   * @return {Number} The radius.
   */
  getRings() {
    return this.rings;
  }
  /**
   * Sets the amount of spiral turns in the occlusion sampling pattern.
   *
   * @deprecated Use rings instead.
   * @param {Number} value - The radius.
   */
  setRings(value) {
    this.rings = value;
  }
  /**
   * The intensity.
   *
   * @type {Number}
   * @deprecated Use SSAOEffect.intensity instead.
   */
  get intensity() {
    return this.uniforms.intensity.value;
  }
  set intensity(value) {
    this.uniforms.intensity.value = value;
    if (this.defines.LEGACY_INTENSITY === void 0) {
      this.defines.LEGACY_INTENSITY = "1";
      this.needsUpdate = true;
    }
  }
  /**
   * Returns the intensity.
   *
   * @deprecated Use SSAOEffect.intensity instead.
   * @return {Number} The intensity.
   */
  getIntensity() {
    return this.uniforms.intensity.value;
  }
  /**
   * Sets the intensity.
   *
   * @deprecated Use SSAOEffect.intensity instead.
   * @param {Number} value - The intensity.
   */
  setIntensity(value) {
    this.uniforms.intensity.value = value;
  }
  /**
   * The depth fade factor.
   *
   * @type {Number}
   */
  get fade() {
    return this.uniforms.fade.value;
  }
  set fade(value) {
    this.uniforms.fade.value = value;
  }
  /**
   * Returns the depth fade factor.
   *
   * @deprecated Use fade instead.
   * @return {Number} The fade factor.
   */
  getFade() {
    return this.uniforms.fade.value;
  }
  /**
   * Sets the depth fade factor.
   *
   * @deprecated Use fade instead.
   * @param {Number} value - The fade factor.
   */
  setFade(value) {
    this.uniforms.fade.value = value;
  }
  /**
   * The depth bias. Range: [0.0, 1.0].
   *
   * @type {Number}
   */
  get bias() {
    return this.uniforms.bias.value;
  }
  set bias(value) {
    this.uniforms.bias.value = value;
  }
  /**
   * Returns the depth bias.
   *
   * @deprecated Use bias instead.
   * @return {Number} The bias.
   */
  getBias() {
    return this.uniforms.bias.value;
  }
  /**
   * Sets the depth bias.
   *
   * @deprecated Use bias instead.
   * @param {Number} value - The bias.
   */
  setBias(value) {
    this.uniforms.bias.value = value;
  }
  /**
   * The minimum radius scale for distance scaling. Range: [0.0, 1.0].
   *
   * @type {Number}
   */
  get minRadiusScale() {
    return this.uniforms.minRadiusScale.value;
  }
  set minRadiusScale(value) {
    this.uniforms.minRadiusScale.value = value;
  }
  /**
   * Returns the minimum radius scale for distance scaling.
   *
   * @deprecated Use minRadiusScale instead.
   * @return {Number} The minimum radius scale.
   */
  getMinRadiusScale() {
    return this.uniforms.minRadiusScale.value;
  }
  /**
   * Sets the minimum radius scale for distance scaling.
   *
   * @deprecated Use minRadiusScale instead.
   * @param {Number} value - The minimum radius scale.
   */
  setMinRadiusScale(value) {
    this.uniforms.minRadiusScale.value = value;
  }
  /**
   * Updates the absolute radius.
   *
   * @private
   */
  updateRadius() {
    const radius = this.r * this.resolution.height;
    this.defines.RADIUS = radius.toFixed(11);
    this.defines.RADIUS_SQ = (radius * radius).toFixed(11);
    this.needsUpdate = true;
  }
  /**
   * The occlusion sampling radius. Range: [0.0, 1.0].
   *
   * @type {Number}
   */
  get radius() {
    return this.r;
  }
  set radius(value) {
    this.r = Math.min(Math.max(value, 1e-6), 1);
    this.updateRadius();
  }
  /**
   * Returns the occlusion sampling radius.
   *
   * @deprecated Use radius instead.
   * @return {Number} The radius.
   */
  getRadius() {
    return this.radius;
  }
  /**
   * Sets the occlusion sampling radius.
   *
   * @deprecated Use radius instead.
   * @param {Number} value - The radius. Range [1e-6, 1.0].
   */
  setRadius(value) {
    this.radius = value;
  }
  /**
   * Indicates whether distance-based radius scaling is enabled.
   *
   * @type {Boolean}
   * @deprecated
   */
  get distanceScaling() {
    return true;
  }
  set distanceScaling(value) {
  }
  /**
   * Indicates whether distance-based radius scaling is enabled.
   *
   * @deprecated
   * @return {Boolean} Whether distance scaling is enabled.
   */
  isDistanceScalingEnabled() {
    return this.distanceScaling;
  }
  /**
   * Enables or disables distance-based radius scaling.
   *
   * @deprecated
   * @param {Boolean} value - Whether distance scaling should be enabled.
   */
  setDistanceScalingEnabled(value) {
    this.distanceScaling = value;
  }
  /**
   * The occlusion distance threshold. Range: [0.0, 1.0].
   *
   * @type {Number}
   */
  get distanceThreshold() {
    return this.uniforms.distanceCutoff.value.x;
  }
  set distanceThreshold(value) {
    this.uniforms.distanceCutoff.value.set(
      Math.min(Math.max(value, 0), 1),
      Math.min(Math.max(value + this.distanceFalloff, 0), 1)
    );
  }
  /**
   * The occlusion distance threshold in world units.
   *
   * @type {Number}
   */
  get worldDistanceThreshold() {
    return -orthographicDepthToViewZ(this.distanceThreshold, this.near, this.far);
  }
  set worldDistanceThreshold(value) {
    this.distanceThreshold = viewZToOrthographicDepth(-value, this.near, this.far);
  }
  /**
   * The occlusion distance falloff. Range: [0.0, 1.0].
   *
   * @type {Number}
   */
  get distanceFalloff() {
    return this.uniforms.distanceCutoff.value.y - this.distanceThreshold;
  }
  set distanceFalloff(value) {
    this.uniforms.distanceCutoff.value.y = Math.min(Math.max(this.distanceThreshold + value, 0), 1);
  }
  /**
   * The occlusion distance falloff in world units.
   *
   * @type {Number}
   */
  get worldDistanceFalloff() {
    return -orthographicDepthToViewZ(this.distanceFalloff, this.near, this.far);
  }
  set worldDistanceFalloff(value) {
    this.distanceFalloff = viewZToOrthographicDepth(-value, this.near, this.far);
  }
  /**
   * Sets the occlusion distance cutoff.
   *
   * @deprecated Use distanceThreshold and distanceFalloff instead.
   * @param {Number} threshold - The distance threshold. Range [0.0, 1.0].
   * @param {Number} falloff - The falloff. Range [0.0, 1.0].
   */
  setDistanceCutoff(threshold, falloff) {
    this.uniforms.distanceCutoff.value.set(
      Math.min(Math.max(threshold, 0), 1),
      Math.min(Math.max(threshold + falloff, 0), 1)
    );
  }
  /**
   * The occlusion proximity threshold. Range: [0.0, 1.0].
   *
   * @type {Number}
   */
  get proximityThreshold() {
    return this.uniforms.proximityCutoff.value.x;
  }
  set proximityThreshold(value) {
    this.uniforms.proximityCutoff.value.set(
      Math.min(Math.max(value, 0), 1),
      Math.min(Math.max(value + this.proximityFalloff, 0), 1)
    );
  }
  /**
   * The occlusion proximity threshold in world units.
   *
   * @type {Number}
   */
  get worldProximityThreshold() {
    return -orthographicDepthToViewZ(this.proximityThreshold, this.near, this.far);
  }
  set worldProximityThreshold(value) {
    this.proximityThreshold = viewZToOrthographicDepth(-value, this.near, this.far);
  }
  /**
   * The occlusion proximity falloff. Range: [0.0, 1.0].
   *
   * @type {Number}
   */
  get proximityFalloff() {
    return this.uniforms.proximityCutoff.value.y - this.proximityThreshold;
  }
  set proximityFalloff(value) {
    this.uniforms.proximityCutoff.value.y = Math.min(Math.max(this.proximityThreshold + value, 0), 1);
  }
  /**
   * The occlusion proximity falloff in world units.
   *
   * @type {Number}
   */
  get worldProximityFalloff() {
    return -orthographicDepthToViewZ(this.proximityFalloff, this.near, this.far);
  }
  set worldProximityFalloff(value) {
    this.proximityFalloff = viewZToOrthographicDepth(-value, this.near, this.far);
  }
  /**
   * Sets the occlusion proximity cutoff.
   *
   * @deprecated Use proximityThreshold and proximityFalloff instead.
   * @param {Number} threshold - The range threshold. Range [0.0, 1.0].
   * @param {Number} falloff - The falloff. Range [0.0, 1.0].
   */
  setProximityCutoff(threshold, falloff) {
    this.uniforms.proximityCutoff.value.set(
      Math.min(Math.max(threshold, 0), 1),
      Math.min(Math.max(threshold + falloff, 0), 1)
    );
  }
  /**
   * Sets the texel size.
   *
   * @deprecated Use setSize() instead.
   * @param {Number} x - The texel width.
   * @param {Number} y - The texel height.
   */
  setTexelSize(x, y) {
    this.uniforms.texelSize.value.set(x, y);
  }
  /**
   * Copies the settings of the given camera.
   *
   * @deprecated Use copyCameraSettings instead.
   * @param {Camera} camera - A camera.
   */
  adoptCameraSettings(camera) {
    this.copyCameraSettings(camera);
  }
  /**
   * Copies the settings of the given camera.
   *
   * @param {Camera} camera - A camera.
   */
  copyCameraSettings(camera) {
    if (camera) {
      this.uniforms.cameraNearFar.value.set(camera.near, camera.far);
      this.uniforms.projectionMatrix.value.copy(camera.projectionMatrix);
      this.uniforms.inverseProjectionMatrix.value.copy(camera.projectionMatrix).invert();
      if (camera instanceof PerspectiveCamera) {
        this.defines.PERSPECTIVE_CAMERA = "1";
      } else {
        delete this.defines.PERSPECTIVE_CAMERA;
      }
      this.needsUpdate = true;
    }
  }
  /**
   * Sets the size of this object.
   *
   * @param {Number} width - The width.
   * @param {Number} height - The height.
   */
  setSize(width, height) {
    const uniforms = this.uniforms;
    const noiseTexture = uniforms.noiseTexture.value;
    if (noiseTexture !== null) {
      uniforms.noiseScale.value.set(
        width / noiseTexture.image.width,
        height / noiseTexture.image.height
      );
    }
    uniforms.texelSize.value.set(1 / width, 1 / height);
    this.resolution.set(width, height);
    this.updateRadius();
  }
};
var depth_downsampling_default = `#include <packing>
#ifdef GL_FRAGMENT_PRECISION_HIGH
uniform highp sampler2D depthBuffer;
#else
uniform mediump sampler2D depthBuffer;
#endif
#ifdef DOWNSAMPLE_NORMALS
uniform lowp sampler2D normalBuffer;
#endif
varying vec2 vUv0;varying vec2 vUv1;varying vec2 vUv2;varying vec2 vUv3;float readDepth(const in vec2 uv){
#if DEPTH_PACKING == 3201
return unpackRGBAToDepth(texture2D(depthBuffer,uv));
#else
return texture2D(depthBuffer,uv).r;
#endif
}int findBestDepth(const in float samples[4]){float c=(samples[0]+samples[1]+samples[2]+samples[3])*0.25;float distances[4];distances[0]=abs(c-samples[0]);distances[1]=abs(c-samples[1]);distances[2]=abs(c-samples[2]);distances[3]=abs(c-samples[3]);float maxDistance=max(max(distances[0],distances[1]),max(distances[2],distances[3]));int remaining[3];int rejected[3];int i,j,k;for(i=0,j=0,k=0;i<4;++i){if(distances[i]<maxDistance){remaining[j++]=i;}else{rejected[k++]=i;}}for(;j<3;++j){remaining[j]=rejected[--k];}vec3 s=vec3(samples[remaining[0]],samples[remaining[1]],samples[remaining[2]]);c=(s.x+s.y+s.z)/3.0;distances[0]=abs(c-s.x);distances[1]=abs(c-s.y);distances[2]=abs(c-s.z);float minDistance=min(distances[0],min(distances[1],distances[2]));for(i=0;i<3;++i){if(distances[i]==minDistance){break;}}return remaining[i];}void main(){float d[4];d[0]=readDepth(vUv0);d[1]=readDepth(vUv1);d[2]=readDepth(vUv2);d[3]=readDepth(vUv3);int index=findBestDepth(d);
#ifdef DOWNSAMPLE_NORMALS
vec3 n[4];n[0]=texture2D(normalBuffer,vUv0).rgb;n[1]=texture2D(normalBuffer,vUv1).rgb;n[2]=texture2D(normalBuffer,vUv2).rgb;n[3]=texture2D(normalBuffer,vUv3).rgb;
#else
vec3 n[4];n[0]=vec3(0.0);n[1]=vec3(0.0);n[2]=vec3(0.0);n[3]=vec3(0.0);
#endif
gl_FragColor=vec4(n[index],d[index]);}`;
var depth_downsampling_default2 = `uniform vec2 texelSize;varying vec2 vUv0;varying vec2 vUv1;varying vec2 vUv2;varying vec2 vUv3;void main(){vec2 uv=position.xy*0.5+0.5;vUv0=uv;vUv1=vec2(uv.x,uv.y+texelSize.y);vUv2=vec2(uv.x+texelSize.x,uv.y);vUv3=uv+texelSize;gl_Position=vec4(position.xy,1.0,1.0);}`;
var DepthDownsamplingMaterial = class extends ShaderMaterial {
  /**
   * Constructs a new depth downsampling material.
   */
  constructor() {
    super({
      name: "DepthDownsamplingMaterial",
      defines: {
        DEPTH_PACKING: "0"
      },
      uniforms: {
        depthBuffer: new Uniform(null),
        normalBuffer: new Uniform(null),
        texelSize: new Uniform(new Vector2())
      },
      blending: NoBlending,
      toneMapped: false,
      depthWrite: false,
      depthTest: false,
      fragmentShader: depth_downsampling_default,
      vertexShader: depth_downsampling_default2
    });
  }
  /**
   * The depth buffer.
   *
   * @type {Texture}
   */
  set depthBuffer(value) {
    this.uniforms.depthBuffer.value = value;
  }
  /**
   * The depth packing strategy.
   *
   * @type {DepthPackingStrategies}
   */
  set depthPacking(value) {
    this.defines.DEPTH_PACKING = value.toFixed(0);
    this.needsUpdate = true;
  }
  /**
   * Sets the depth buffer.
   *
   * @deprecated Use depthBuffer and depthPacking instead.
   * @param {Texture} buffer - The depth texture.
   * @param {DepthPackingStrategies} [depthPacking=BasicDepthPacking] - The depth packing strategy.
   */
  setDepthBuffer(buffer2, depthPacking = BasicDepthPacking) {
    this.depthBuffer = buffer2;
    this.depthPacking = depthPacking;
  }
  /**
   * The normal buffer.
   *
   * @type {Texture}
   */
  set normalBuffer(value) {
    this.uniforms.normalBuffer.value = value;
    if (value !== null) {
      this.defines.DOWNSAMPLE_NORMALS = "1";
    } else {
      delete this.defines.DOWNSAMPLE_NORMALS;
    }
    this.needsUpdate = true;
  }
  /**
   * Sets the normal buffer.
   *
   * @deprecated Use normalBuffer instead.
   * @param {Texture} value - The normal buffer.
   */
  setNormalBuffer(value) {
    this.normalBuffer = value;
  }
  /**
   * Sets the texel size.
   *
   * @deprecated Use setSize() instead.
   * @param {Number} x - The texel width.
   * @param {Number} y - The texel height.
   */
  setTexelSize(x, y) {
    this.uniforms.texelSize.value.set(x, y);
  }
  /**
   * Sets the size of this object.
   *
   * @param {Number} width - The width.
   * @param {Number} height - The height.
   */
  setSize(width, height) {
    this.uniforms.texelSize.value.set(1 / width, 1 / height);
  }
};
var DepthDownsamplingPass = class extends Pass {
  /**
   * Constructs a new depth downsampling pass.
   *
   * @param {Object} [options] - The options.
   * @param {Texture} [options.normalBuffer=null] - A texture that contains view space normals. See {@link NormalPass}.
   * @param {Number} [options.resolutionScale=0.5] - The resolution scale.
   * @param {Number} [options.resolutionX=Resolution.AUTO_SIZE] - The horizontal resolution.
   * @param {Number} [options.resolutionY=Resolution.AUTO_SIZE] - The vertical resolution.
   * @param {Number} [options.width=Resolution.AUTO_SIZE] - Deprecated. Use resolutionX instead.
   * @param {Number} [options.height=Resolution.AUTO_SIZE] - Deprecated. Use resolutionY instead.
   */
  constructor({
    normalBuffer = null,
    resolutionScale = 0.5,
    width = Resolution.AUTO_SIZE,
    height = Resolution.AUTO_SIZE,
    resolutionX = width,
    resolutionY = height
  } = {}) {
    super("DepthDownsamplingPass");
    const material = new DepthDownsamplingMaterial();
    material.normalBuffer = normalBuffer;
    this.fullscreenMaterial = material;
    this.needsDepthTexture = true;
    this.needsSwap = false;
    this.renderTarget = new WebGLRenderTarget(1, 1, {
      minFilter: NearestFilter,
      magFilter: NearestFilter,
      depthBuffer: false,
      type: FloatType
    });
    this.renderTarget.texture.name = "DepthDownsamplingPass.Target";
    this.renderTarget.texture.generateMipmaps = false;
    const resolution = this.resolution = new Resolution(this, resolutionX, resolutionY, resolutionScale);
    resolution.addEventListener("change", (e) => this.setSize(resolution.baseWidth, resolution.baseHeight));
  }
  /**
   * The normal(RGB) + depth(A) texture.
   *
   * @type {Texture}
   */
  get texture() {
    return this.renderTarget.texture;
  }
  /**
   * Returns the normal(RGB) + depth(A) texture.
   *
   * @deprecated Use texture instead.
   * @return {Texture} The texture.
   */
  getTexture() {
    return this.renderTarget.texture;
  }
  /**
   * Returns the resolution settings.
   *
   * @deprecated Use resolution instead.
   * @return {Resolution} The resolution.
   */
  getResolution() {
    return this.resolution;
  }
  /**
   * Sets the depth texture.
   *
   * @param {Texture} depthTexture - A depth texture.
   * @param {DepthPackingStrategies} [depthPacking=BasicDepthPacking] - The depth packing strategy.
   */
  setDepthTexture(depthTexture, depthPacking = BasicDepthPacking) {
    this.fullscreenMaterial.depthBuffer = depthTexture;
    this.fullscreenMaterial.depthPacking = depthPacking;
  }
  /**
   * Downsamples depth and scene normals.
   *
   * @param {WebGLRenderer} renderer - The renderer.
   * @param {WebGLRenderTarget} inputBuffer - A frame buffer that contains the result of the previous pass.
   * @param {WebGLRenderTarget} outputBuffer - A frame buffer that serves as the output render target unless this pass renders to screen.
   * @param {Number} [deltaTime] - The time between the last frame and the current one in seconds.
   * @param {Boolean} [stencilTest] - Indicates whether a stencil mask is active.
   */
  render(renderer, inputBuffer, outputBuffer, deltaTime, stencilTest) {
    renderer.setRenderTarget(this.renderToScreen ? null : this.renderTarget);
    renderer.render(this.scene, this.camera);
  }
  /**
   * Updates the size of this pass.
   *
   * @param {Number} width - The width.
   * @param {Number} height - The height.
   */
  setSize(width, height) {
    const resolution = this.resolution;
    resolution.setBaseSize(width, height);
    this.renderTarget.setSize(resolution.width, resolution.height);
    this.fullscreenMaterial.setSize(width, height);
  }
  /**
   * Performs initialization tasks.
   *
   * @param {WebGLRenderer} renderer - The renderer.
   * @param {Boolean} alpha - Whether the renderer uses the alpha channel or not.
   * @param {Number} frameBufferType - The type of the main frame buffers.
   */
  initialize(renderer, alpha, frameBufferType) {
    const gl = renderer.getContext();
    const renderable = gl.getExtension("EXT_color_buffer_float") || gl.getExtension("EXT_color_buffer_half_float");
    if (!renderable) {
      throw new Error("Rendering to float texture is not supported.");
    }
  }
};
var ssao_default3 = `uniform lowp sampler2D aoBuffer;uniform float luminanceInfluence;uniform float intensity;
#if defined(DEPTH_AWARE_UPSAMPLING) && defined(NORMAL_DEPTH)
#ifdef GL_FRAGMENT_PRECISION_HIGH
uniform highp sampler2D normalDepthBuffer;
#else
uniform mediump sampler2D normalDepthBuffer;
#endif
#endif
#ifdef COLORIZE
uniform vec3 color;
#endif
void mainImage(const in vec4 inputColor,const in vec2 uv,const in float depth,out vec4 outputColor){float aoLinear=texture2D(aoBuffer,uv).r;
#if defined(DEPTH_AWARE_UPSAMPLING) && defined(NORMAL_DEPTH) && __VERSION__ == 300
vec4 normalDepth[4];normalDepth[0]=textureOffset(normalDepthBuffer,uv,ivec2(0,0));normalDepth[1]=textureOffset(normalDepthBuffer,uv,ivec2(0,1));normalDepth[2]=textureOffset(normalDepthBuffer,uv,ivec2(1,0));normalDepth[3]=textureOffset(normalDepthBuffer,uv,ivec2(1,1));float dot01=dot(normalDepth[0].rgb,normalDepth[1].rgb);float dot02=dot(normalDepth[0].rgb,normalDepth[2].rgb);float dot03=dot(normalDepth[0].rgb,normalDepth[3].rgb);float minDot=min(dot01,min(dot02,dot03));float s=step(THRESHOLD,minDot);float smallestDistance=1.0;int index;for(int i=0;i<4;++i){float distance=abs(depth-normalDepth[i].a);if(distance<smallestDistance){smallestDistance=distance;index=i;}}ivec2 offsets[4];offsets[0]=ivec2(0,0);offsets[1]=ivec2(0,1);offsets[2]=ivec2(1,0);offsets[3]=ivec2(1,1);ivec2 coord=ivec2(uv*vec2(textureSize(aoBuffer,0)))+offsets[index];float aoNearest=texelFetch(aoBuffer,coord,0).r;float ao=mix(aoNearest,aoLinear,s);
#else
float ao=aoLinear;
#endif
float l=luminance(inputColor.rgb);ao=mix(ao,0.0,l*luminanceInfluence);ao=clamp(ao*intensity,0.0,1.0);
#ifdef COLORIZE
outputColor=vec4(1.0-ao*(1.0-color),inputColor.a);
#else
outputColor=vec4(vec3(1.0-ao),inputColor.a);
#endif
}`;
var NOISE_TEXTURE_SIZE = 64;
var SSAOEffect = class extends Effect {
  /**
   * Constructs a new SSAO effect.
   *
   * @todo Move normalBuffer to options.
   * @param {Camera} [camera] - The main camera.
   * @param {Texture} [normalBuffer] - A texture that contains the scene normals.
   * @param {Object} [options] - The options.
   * @param {BlendFunction} [options.blendFunction=BlendFunction.MULTIPLY] - The blend function of this effect.
   * @param {Boolean} [options.distanceScaling=true] - Deprecated.
   * @param {Boolean} [options.depthAwareUpsampling=true] - Enables or disables depth-aware upsampling. Has no effect if WebGL 2 is not supported.
   * @param {Texture} [options.normalDepthBuffer=null] - Deprecated.
   * @param {Number} [options.samples=9] - The amount of samples per pixel. Should not be a multiple of the ring count.
   * @param {Number} [options.rings=7] - The amount of spiral turns in the occlusion sampling pattern. Should be a prime number.
   * @param {Number} [options.worldDistanceThreshold] - The world distance threshold at which the occlusion effect starts to fade out.
   * @param {Number} [options.worldDistanceFalloff] - The world distance falloff. Influences the smoothness of the occlusion cutoff.
   * @param {Number} [options.worldProximityThreshold] - The world proximity threshold at which the occlusion starts to fade out.
   * @param {Number} [options.worldProximityFalloff] - The world proximity falloff. Influences the smoothness of the proximity cutoff.
   * @param {Number} [options.distanceThreshold=0.97] - Deprecated.
   * @param {Number} [options.distanceFalloff=0.03] - Deprecated.
   * @param {Number} [options.rangeThreshold=0.0005] - Deprecated.
   * @param {Number} [options.rangeFalloff=0.001] - Deprecated.
   * @param {Number} [options.minRadiusScale=0.1] - The minimum radius scale.
   * @param {Number} [options.luminanceInfluence=0.7] - Determines how much the luminance of the scene influences the ambient occlusion.
   * @param {Number} [options.radius=0.1825] - The occlusion sampling radius, expressed as a scale relative to the resolution. Range [1e-6, 1.0].
   * @param {Number} [options.intensity=1.0] - The intensity of the ambient occlusion.
   * @param {Number} [options.bias=0.025] - An occlusion bias. Eliminates artifacts caused by depth discontinuities.
   * @param {Number} [options.fade=0.01] - Influences the smoothness of the shadows. A lower value results in higher contrast.
   * @param {Color} [options.color=null] - The color of the ambient occlusion.
   * @param {Number} [options.resolutionScale=1.0] - The resolution scale.
   * @param {Number} [options.resolutionX=Resolution.AUTO_SIZE] - The horizontal resolution.
   * @param {Number} [options.resolutionY=Resolution.AUTO_SIZE] - The vertical resolution.
   * @param {Number} [options.width=Resolution.AUTO_SIZE] - Deprecated. Use resolutionX instead.
   * @param {Number} [options.height=Resolution.AUTO_SIZE] - Deprecated. Use resolutionY instead.
   */
  constructor(camera, normalBuffer, {
    blendFunction = BlendFunction.MULTIPLY,
    samples = 9,
    rings = 7,
    normalDepthBuffer = null,
    depthAwareUpsampling = true,
    worldDistanceThreshold,
    worldDistanceFalloff,
    worldProximityThreshold,
    worldProximityFalloff,
    distanceThreshold = 0.97,
    distanceFalloff = 0.03,
    rangeThreshold = 5e-4,
    rangeFalloff = 1e-3,
    minRadiusScale = 0.1,
    luminanceInfluence = 0.7,
    radius = 0.1825,
    intensity = 1,
    bias = 0.025,
    fade: fade2 = 0.01,
    color: color2 = null,
    resolutionScale = 1,
    width = Resolution.AUTO_SIZE,
    height = Resolution.AUTO_SIZE,
    resolutionX = width,
    resolutionY = height
  } = {}) {
    super("SSAOEffect", ssao_default3, {
      blendFunction,
      attributes: EffectAttribute.DEPTH,
      defines: /* @__PURE__ */ new Map([
        ["THRESHOLD", "0.997"]
      ]),
      uniforms: /* @__PURE__ */ new Map([
        ["aoBuffer", new Uniform(null)],
        ["normalDepthBuffer", new Uniform(normalDepthBuffer)],
        ["luminanceInfluence", new Uniform(luminanceInfluence)],
        ["color", new Uniform(null)],
        ["intensity", new Uniform(intensity)],
        ["scale", new Uniform(0)]
        // Unused.
      ])
    });
    this.renderTarget = new WebGLRenderTarget(1, 1, { depthBuffer: false });
    this.renderTarget.texture.name = "AO.Target";
    this.uniforms.get("aoBuffer").value = this.renderTarget.texture;
    const resolution = this.resolution = new Resolution(this, resolutionX, resolutionY, resolutionScale);
    resolution.addEventListener("change", (e) => this.setSize(resolution.baseWidth, resolution.baseHeight));
    this.camera = camera;
    this.depthDownsamplingPass = new DepthDownsamplingPass({ normalBuffer, resolutionScale });
    this.depthDownsamplingPass.enabled = normalDepthBuffer === null;
    this.ssaoPass = new ShaderPass(new SSAOMaterial(camera));
    const noiseTexture = new NoiseTexture(NOISE_TEXTURE_SIZE, NOISE_TEXTURE_SIZE, RGBAFormat);
    noiseTexture.wrapS = noiseTexture.wrapT = RepeatWrapping;
    const ssaoMaterial = this.ssaoMaterial;
    ssaoMaterial.normalBuffer = normalBuffer;
    ssaoMaterial.noiseTexture = noiseTexture;
    ssaoMaterial.minRadiusScale = minRadiusScale;
    ssaoMaterial.samples = samples;
    ssaoMaterial.radius = radius;
    ssaoMaterial.rings = rings;
    ssaoMaterial.fade = fade2;
    ssaoMaterial.bias = bias;
    ssaoMaterial.distanceThreshold = distanceThreshold;
    ssaoMaterial.distanceFalloff = distanceFalloff;
    ssaoMaterial.proximityThreshold = rangeThreshold;
    ssaoMaterial.proximityFalloff = rangeFalloff;
    if (worldDistanceThreshold !== void 0) {
      ssaoMaterial.worldDistanceThreshold = worldDistanceThreshold;
    }
    if (worldDistanceFalloff !== void 0) {
      ssaoMaterial.worldDistanceFalloff = worldDistanceFalloff;
    }
    if (worldProximityThreshold !== void 0) {
      ssaoMaterial.worldProximityThreshold = worldProximityThreshold;
    }
    if (worldProximityFalloff !== void 0) {
      ssaoMaterial.worldProximityFalloff = worldProximityFalloff;
    }
    if (normalDepthBuffer !== null) {
      this.ssaoMaterial.normalDepthBuffer = normalDepthBuffer;
      this.defines.set("NORMAL_DEPTH", "1");
    }
    this.depthAwareUpsampling = depthAwareUpsampling;
    this.color = color2;
  }
  set mainCamera(value) {
    this.camera = value;
    this.ssaoMaterial.copyCameraSettings(value);
  }
  /**
   * Sets the normal buffer.
   *
   * @type {Texture}
   */
  get normalBuffer() {
    return this.ssaoMaterial.normalBuffer;
  }
  set normalBuffer(value) {
    this.ssaoMaterial.normalBuffer = value;
    this.depthDownsamplingPass.fullscreenMaterial.normalBuffer = value;
  }
  /**
   * Returns the resolution settings.
   *
   * @deprecated Use resolution instead.
   * @return {Resolution} The resolution.
   */
  getResolution() {
    return this.resolution;
  }
  /**
   * The SSAO material.
   *
   * @type {SSAOMaterial}
   */
  get ssaoMaterial() {
    return this.ssaoPass.fullscreenMaterial;
  }
  /**
   * Returns the SSAO material.
   *
   * @deprecated Use ssaoMaterial instead.
   * @return {SSAOMaterial} The material.
   */
  getSSAOMaterial() {
    return this.ssaoMaterial;
  }
  /**
   * The amount of occlusion samples per pixel.
   *
   * @type {Number}
   * @deprecated Use ssaoMaterial.samples instead.
   */
  get samples() {
    return this.ssaoMaterial.samples;
  }
  set samples(value) {
    this.ssaoMaterial.samples = value;
  }
  /**
   * The amount of spiral turns in the occlusion sampling pattern.
   *
   * @type {Number}
   * @deprecated Use ssaoMaterial.rings instead.
   */
  get rings() {
    return this.ssaoMaterial.rings;
  }
  set rings(value) {
    this.ssaoMaterial.rings = value;
  }
  /**
   * The occlusion sampling radius.
   *
   * @type {Number}
   * @deprecated Use ssaoMaterial.radius instead.
   */
  get radius() {
    return this.ssaoMaterial.radius;
  }
  set radius(value) {
    this.ssaoMaterial.radius = value;
  }
  /**
   * Indicates whether depth-aware upsampling is enabled.
   *
   * @type {Boolean}
   */
  get depthAwareUpsampling() {
    return this.defines.has("DEPTH_AWARE_UPSAMPLING");
  }
  set depthAwareUpsampling(value) {
    if (this.depthAwareUpsampling !== value) {
      if (value) {
        this.defines.set("DEPTH_AWARE_UPSAMPLING", "1");
      } else {
        this.defines.delete("DEPTH_AWARE_UPSAMPLING");
      }
      this.setChanged();
    }
  }
  /**
   * Indicates whether depth-aware upsampling is enabled.
   *
   * @deprecated Use depthAwareUpsampling instead.
   * @return {Boolean} Whether depth-aware upsampling is enabled.
   */
  isDepthAwareUpsamplingEnabled() {
    return this.depthAwareUpsampling;
  }
  /**
   * Enables or disables depth-aware upsampling.
   *
   * @deprecated Use depthAwareUpsampling instead.
   * @param {Boolean} value - Whether depth-aware upsampling should be enabled.
   */
  setDepthAwareUpsamplingEnabled(value) {
    this.depthAwareUpsampling = value;
  }
  /**
   * Indicates whether distance-based radius scaling is enabled.
   *
   * @type {Boolean}
   * @deprecated
   */
  get distanceScaling() {
    return true;
  }
  set distanceScaling(value) {
  }
  /**
   * The color of the ambient occlusion. Set to `null` to disable.
   *
   * @type {Color}
   */
  get color() {
    return this.uniforms.get("color").value;
  }
  set color(value) {
    const uniforms = this.uniforms;
    const defines = this.defines;
    if (value !== null) {
      if (defines.has("COLORIZE")) {
        uniforms.get("color").value.set(value);
      } else {
        defines.set("COLORIZE", "1");
        uniforms.get("color").value = new Color(value);
        this.setChanged();
      }
    } else if (defines.has("COLORIZE")) {
      defines.delete("COLORIZE");
      uniforms.get("color").value = null;
      this.setChanged();
    }
  }
  /**
   * The luminance influence factor. Range: [0.0, 1.0].
   *
   * @type {Boolean}
   */
  get luminanceInfluence() {
    return this.uniforms.get("luminanceInfluence").value;
  }
  set luminanceInfluence(value) {
    this.uniforms.get("luminanceInfluence").value = value;
  }
  /**
   * The intensity.
   *
   * @type {Number}
   */
  get intensity() {
    return this.uniforms.get("intensity").value;
  }
  set intensity(value) {
    this.uniforms.get("intensity").value = value;
  }
  /**
   * Returns the color of the ambient occlusion.
   *
   * @deprecated Use color instead.
   * @return {Color} The color.
   */
  getColor() {
    return this.color;
  }
  /**
   * Sets the color of the ambient occlusion. Set to `null` to disable colorization.
   *
   * @deprecated Use color instead.
   * @param {Color} value - The color.
   */
  setColor(value) {
    this.color = value;
  }
  /**
   * Sets the occlusion distance cutoff.
   *
   * @deprecated Use ssaoMaterial instead.
   * @param {Number} threshold - The distance threshold. Range [0.0, 1.0].
   * @param {Number} falloff - The falloff. Range [0.0, 1.0].
   */
  setDistanceCutoff(threshold, falloff) {
    this.ssaoMaterial.distanceThreshold = threshold;
    this.ssaoMaterial.distanceFalloff = falloff;
  }
  /**
   * Sets the occlusion proximity cutoff.
   *
   * @deprecated Use ssaoMaterial instead.
   * @param {Number} threshold - The proximity threshold. Range [0.0, 1.0].
   * @param {Number} falloff - The falloff. Range [0.0, 1.0].
   */
  setProximityCutoff(threshold, falloff) {
    this.ssaoMaterial.proximityThreshold = threshold;
    this.ssaoMaterial.proximityFalloff = falloff;
  }
  /**
   * Sets the depth texture.
   *
   * @param {Texture} depthTexture - A depth texture.
   * @param {DepthPackingStrategies} [depthPacking=BasicDepthPacking] - The depth packing.
   */
  setDepthTexture(depthTexture, depthPacking = BasicDepthPacking) {
    this.depthDownsamplingPass.setDepthTexture(depthTexture, depthPacking);
    this.ssaoMaterial.depthBuffer = depthTexture;
    this.ssaoMaterial.depthPacking = depthPacking;
  }
  /**
   * Updates this effect.
   *
   * @param {WebGLRenderer} renderer - The renderer.
   * @param {WebGLRenderTarget} inputBuffer - A frame buffer that contains the result of the previous pass.
   * @param {Number} [deltaTime] - The time between the last frame and the current one in seconds.
   */
  update(renderer, inputBuffer, deltaTime) {
    const renderTarget = this.renderTarget;
    if (this.depthDownsamplingPass.enabled) {
      this.depthDownsamplingPass.render(renderer);
    }
    this.ssaoPass.render(renderer, null, renderTarget);
  }
  /**
   * Sets the size.
   *
   * @param {Number} width - The width.
   * @param {Number} height - The height.
   */
  setSize(width, height) {
    const resolution = this.resolution;
    resolution.setBaseSize(width, height);
    const w2 = resolution.width, h = resolution.height;
    this.ssaoMaterial.copyCameraSettings(this.camera);
    this.ssaoMaterial.setSize(w2, h);
    this.renderTarget.setSize(w2, h);
    this.depthDownsamplingPass.resolution.scale = resolution.scale;
    this.depthDownsamplingPass.setSize(width, height);
  }
  /**
   * Performs initialization tasks.
   *
   * @param {WebGLRenderer} renderer - The renderer.
   * @param {Boolean} alpha - Whether the renderer uses the alpha channel or not.
   * @param {Number} frameBufferType - The type of the main frame buffers.
   */
  initialize(renderer, alpha, frameBufferType) {
    try {
      let normalDepthBuffer = this.uniforms.get("normalDepthBuffer").value;
      if (normalDepthBuffer === null) {
        this.depthDownsamplingPass.initialize(renderer, alpha, frameBufferType);
        normalDepthBuffer = this.depthDownsamplingPass.texture;
        this.uniforms.get("normalDepthBuffer").value = normalDepthBuffer;
        this.ssaoMaterial.normalDepthBuffer = normalDepthBuffer;
        this.defines.set("NORMAL_DEPTH", "1");
      }
    } catch (e) {
      this.depthDownsamplingPass.enabled = false;
    }
  }
};
var texture_default = `#ifdef TEXTURE_PRECISION_HIGH
uniform mediump sampler2D map;
#else
uniform lowp sampler2D map;
#endif
varying vec2 vUv2;void mainImage(const in vec4 inputColor,const in vec2 uv,out vec4 outputColor){
#ifdef UV_TRANSFORM
vec4 texel=texture2D(map,vUv2);
#else
vec4 texel=texture2D(map,uv);
#endif
outputColor=TEXEL;outputColor.a=max(inputColor.a,outputColor.a);}`;
var texture_default2 = `#ifdef ASPECT_CORRECTION
uniform float scale;
#else
uniform mat3 uvTransform;
#endif
varying vec2 vUv2;void mainSupport(const in vec2 uv){
#ifdef ASPECT_CORRECTION
vUv2=uv*vec2(aspect,1.0)*scale;
#else
vUv2=(uvTransform*vec3(uv,1.0)).xy;
#endif
}`;
var TextureEffect = class extends Effect {
  /**
   * Constructs a new texture effect.
   *
   * @param {Object} [options] - The options.
   * @param {BlendFunction} [options.blendFunction] - The blend function of this effect.
   * @param {Texture} [options.texture] - A texture.
   * @param {Boolean} [options.aspectCorrection=false] - Deprecated. Adjust the texture's offset, repeat and center instead.
   */
  constructor({ blendFunction, texture = null, aspectCorrection = false } = {}) {
    super("TextureEffect", texture_default, {
      blendFunction,
      defines: /* @__PURE__ */ new Map([
        ["TEXEL", "texel"]
      ]),
      uniforms: /* @__PURE__ */ new Map([
        ["map", new Uniform(null)],
        ["scale", new Uniform(1)],
        ["uvTransform", new Uniform(null)]
      ])
    });
    this.texture = texture;
    this.aspectCorrection = aspectCorrection;
  }
  /**
   * The texture.
   *
   * @type {Texture}
   */
  get texture() {
    return this.uniforms.get("map").value;
  }
  set texture(value) {
    const prevTexture = this.texture;
    const uniforms = this.uniforms;
    const defines = this.defines;
    if (prevTexture !== value) {
      uniforms.get("map").value = value;
      uniforms.get("uvTransform").value = value.matrix;
      defines.delete("TEXTURE_PRECISION_HIGH");
      if (value !== null) {
        if (value.matrixAutoUpdate) {
          defines.set("UV_TRANSFORM", "1");
          this.setVertexShader(texture_default2);
        } else {
          defines.delete("UV_TRANSFORM");
          this.setVertexShader(null);
        }
        if (value.type !== UnsignedByteType) {
          defines.set("TEXTURE_PRECISION_HIGH", "1");
        }
        if (prevTexture === null || prevTexture.type !== value.type || prevTexture.encoding !== value.encoding) {
          this.setChanged();
        }
      }
    }
  }
  /**
   * Returns the texture.
   *
   * @deprecated Use texture instead.
   * @return {Texture} The texture.
   */
  getTexture() {
    return this.texture;
  }
  /**
   * Sets the texture.
   *
   * @deprecated Use texture instead.
   * @param {Texture} value - The texture.
   */
  setTexture(value) {
    this.texture = value;
  }
  /**
   * Indicates whether aspect correction is enabled.
   *
   * @type {Number}
   * @deprecated Adjust the texture's offset, repeat, rotation and center instead.
   */
  get aspectCorrection() {
    return this.defines.has("ASPECT_CORRECTION");
  }
  set aspectCorrection(value) {
    if (this.aspectCorrection !== value) {
      if (value) {
        this.defines.set("ASPECT_CORRECTION", "1");
      } else {
        this.defines.delete("ASPECT_CORRECTION");
      }
      this.setChanged();
    }
  }
  /**
   * Indicates whether the texture UV coordinates will be transformed using the transformation matrix of the texture.
   *
   * @type {Boolean}
   * @deprecated Use texture.matrixAutoUpdate instead.
   */
  get uvTransform() {
    const texture = this.texture;
    return texture !== null && texture.matrixAutoUpdate;
  }
  set uvTransform(value) {
    const texture = this.texture;
    if (texture !== null) {
      texture.matrixAutoUpdate = value;
    }
  }
  /**
   * Sets the swizzles that will be applied to the components of a texel before it is written to the output color.
   *
   * @param {ColorChannel} r - The swizzle for the `r` component.
   * @param {ColorChannel} [g=r] - The swizzle for the `g` component.
   * @param {ColorChannel} [b=r] - The swizzle for the `b` component.
   * @param {ColorChannel} [a=r] - The swizzle for the `a` component.
   */
  setTextureSwizzleRGBA(r, g = r, b = r, a = r) {
    const rgba = "rgba";
    let swizzle2 = "";
    if (r !== ColorChannel.RED || g !== ColorChannel.GREEN || b !== ColorChannel.BLUE || a !== ColorChannel.ALPHA) {
      swizzle2 = [".", rgba[r], rgba[g], rgba[b], rgba[a]].join("");
    }
    this.defines.set("TEXEL", "texel" + swizzle2);
    this.setChanged();
  }
  /**
   * Updates this effect.
   *
   * @param {WebGLRenderer} renderer - The renderer.
   * @param {WebGLRenderTarget} inputBuffer - A frame buffer that contains the result of the previous pass.
   * @param {Number} [deltaTime] - The time between the last frame and the current one in seconds.
   */
  update(renderer, inputBuffer, deltaTime) {
    if (this.texture.matrixAutoUpdate) {
      this.texture.updateMatrix();
    }
  }
};
var convolution_tilt_shift_default = `#ifdef FRAMEBUFFER_PRECISION_HIGH
uniform mediump sampler2D inputBuffer;
#else
uniform lowp sampler2D inputBuffer;
#endif
uniform vec4 maskParams;varying vec2 vUv;varying vec2 vUv2;varying vec2 vOffset;float linearGradientMask(const in float x){return smoothstep(maskParams.x,maskParams.y,x)-smoothstep(maskParams.w,maskParams.z,x);}void main(){vec2 dUv=vOffset*(1.0-linearGradientMask(vUv2.y));vec4 sum=texture2D(inputBuffer,vec2(vUv.x-dUv.x,vUv.y+dUv.y));sum+=texture2D(inputBuffer,vec2(vUv.x+dUv.x,vUv.y+dUv.y));sum+=texture2D(inputBuffer,vec2(vUv.x+dUv.x,vUv.y-dUv.y));sum+=texture2D(inputBuffer,vec2(vUv.x-dUv.x,vUv.y-dUv.y));gl_FragColor=sum*0.25;
#include <colorspace_fragment>
}`;
var convolution_tilt_shift_default2 = `uniform vec4 texelSize;uniform float kernel;uniform float scale;uniform float aspect;uniform vec2 rotation;varying vec2 vUv;varying vec2 vUv2;varying vec2 vOffset;void main(){vec2 uv=position.xy*0.5+0.5;vUv=uv;vUv2=(uv-0.5)*2.0*vec2(aspect,1.0);vUv2=vec2(dot(rotation,vUv2),dot(rotation,vec2(vUv2.y,-vUv2.x)));vOffset=(texelSize.xy*vec2(kernel)+texelSize.zw)*scale;gl_Position=vec4(position.xy,1.0,1.0);}`;
var TiltShiftBlurMaterial = class extends KawaseBlurMaterial {
  /**
   * Constructs a new tilt shift blur material.
   *
   * @param {Object} [options] - The options.
   * @param {Number} [options.offset=0.0] - The relative offset of the focus area.
   * @param {Number} [options.rotation=0.0] - The rotation of the focus area in radians.
   * @param {Number} [options.focusArea=0.4] - The relative size of the focus area.
   * @param {Number} [options.feather=0.3] - The softness of the focus area edges.
   */
  constructor({
    kernelSize = KernelSize.MEDIUM,
    offset = 0,
    rotation = 0,
    focusArea = 0.4,
    feather = 0.3
  } = {}) {
    super();
    this.fragmentShader = convolution_tilt_shift_default;
    this.vertexShader = convolution_tilt_shift_default2;
    this.kernelSize = kernelSize;
    this.uniforms.aspect = new Uniform(1);
    this.uniforms.rotation = new Uniform(new Vector2());
    this.uniforms.maskParams = new Uniform(new Vector4());
    this._offset = offset;
    this._focusArea = focusArea;
    this._feather = feather;
    this.rotation = rotation;
    this.updateParams();
  }
  /**
   * The relative offset of the focus area.
   *
   * @private
   */
  updateParams() {
    const params = this.uniforms.maskParams.value;
    const a = Math.max(this.focusArea, 0);
    const b = Math.max(a - this.feather, 0);
    params.set(
      this.offset - a,
      this.offset - b,
      this.offset + a,
      this.offset + b
    );
  }
  /**
   * The rotation of the focus area in radians.
   *
   * @type {Number}
   */
  get rotation() {
    return Math.acos(this.uniforms.rotation.value.x);
  }
  set rotation(value) {
    this.uniforms.rotation.value.set(Math.cos(value), Math.sin(value));
  }
  /**
   * The relative offset of the focus area.
   *
   * @type {Number}
   */
  get offset() {
    return this._offset;
  }
  set offset(value) {
    this._offset = value;
    this.updateParams();
  }
  /**
   * The relative size of the focus area.
   *
   * @type {Number}
   */
  get focusArea() {
    return this._focusArea;
  }
  set focusArea(value) {
    this._focusArea = value;
    this.updateParams();
  }
  /**
   * The softness of the focus area edges.
   *
   * @type {Number}
   */
  get feather() {
    return this._feather;
  }
  set feather(value) {
    this._feather = value;
    this.updateParams();
  }
  /**
   * Sets the size of this object.
   *
   * @param {Number} width - The width.
   * @param {Number} height - The height.
   */
  setSize(width, height) {
    super.setSize(width, height);
    this.uniforms.aspect.value = width / height;
  }
};
var TiltShiftBlurPass = class extends KawaseBlurPass {
  /**
   * Constructs a new Kawase blur pass.
   *
   * @param {Object} [options] - The options.
   * @param {Number} [options.offset=0.0] - The relative offset of the focus area.
   * @param {Number} [options.rotation=0.0] - The rotation of the focus area in radians.
   * @param {Number} [options.focusArea=0.4] - The relative size of the focus area.
   * @param {Number} [options.feather=0.3] - The softness of the focus area edges.
   * @param {KernelSize} [options.kernelSize=KernelSize.MEDIUM] - The blur kernel size.
   * @param {Number} [options.resolutionScale=0.5] - The resolution scale.
   * @param {Number} [options.resolutionX=Resolution.AUTO_SIZE] - The horizontal resolution.
   * @param {Number} [options.resolutionY=Resolution.AUTO_SIZE] - The vertical resolution.
   */
  constructor({
    offset = 0,
    rotation = 0,
    focusArea = 0.4,
    feather = 0.3,
    kernelSize = KernelSize.MEDIUM,
    resolutionScale = 0.5,
    resolutionX = Resolution.AUTO_SIZE,
    resolutionY = Resolution.AUTO_SIZE
  } = {}) {
    super({ kernelSize, resolutionScale, resolutionX, resolutionY });
    this.blurMaterial = new TiltShiftBlurMaterial({ kernelSize, offset, rotation, focusArea, feather });
  }
};
var tilt_shift_default = `#ifdef FRAMEBUFFER_PRECISION_HIGH
uniform mediump sampler2D map;
#else
uniform lowp sampler2D map;
#endif
uniform vec2 maskParams;varying vec2 vUv2;float linearGradientMask(const in float x){return step(maskParams.x,x)-step(maskParams.y,x);}void mainImage(const in vec4 inputColor,const in vec2 uv,out vec4 outputColor){float mask=linearGradientMask(vUv2.y);vec4 texel=texture2D(map,uv);outputColor=mix(texel,inputColor,mask);}`;
var tilt_shift_default2 = `uniform vec2 rotation;varying vec2 vUv2;void mainSupport(const in vec2 uv){vUv2=(uv-0.5)*2.0*vec2(aspect,1.0);vUv2=vec2(dot(rotation,vUv2),dot(rotation,vec2(vUv2.y,-vUv2.x)));}`;
var TiltShiftEffect = class extends Effect {
  /**
   * Constructs a new tilt shift Effect
   *
   * @param {Object} [options] - The options.
   * @param {BlendFunction} [options.blendFunction] - The blend function of this effect.
   * @param {Number} [options.offset=0.0] - The relative offset of the focus area.
   * @param {Number} [options.rotation=0.0] - The rotation of the focus area in radians.
   * @param {Number} [options.focusArea=0.4] - The relative size of the focus area.
   * @param {Number} [options.feather=0.3] - The softness of the focus area edges.
   * @param {Number} [options.bias=0.06] - Deprecated.
   * @param {KernelSize} [options.kernelSize=KernelSize.MEDIUM] - The blur kernel size.
   * @param {Number} [options.resolutionScale=0.5] - The resolution scale.
   * @param {Number} [options.resolutionX=Resolution.AUTO_SIZE] - The horizontal resolution.
   * @param {Number} [options.resolutionY=Resolution.AUTO_SIZE] - The vertical resolution.
   */
  constructor({
    blendFunction,
    offset = 0,
    rotation = 0,
    focusArea = 0.4,
    feather = 0.3,
    kernelSize = KernelSize.MEDIUM,
    resolutionScale = 0.5,
    resolutionX = Resolution.AUTO_SIZE,
    resolutionY = Resolution.AUTO_SIZE
  } = {}) {
    super("TiltShiftEffect", tilt_shift_default, {
      vertexShader: tilt_shift_default2,
      blendFunction,
      uniforms: /* @__PURE__ */ new Map([
        ["rotation", new Uniform(new Vector2())],
        ["maskParams", new Uniform(new Vector2())],
        ["map", new Uniform(null)]
      ])
    });
    this._offset = offset;
    this._focusArea = focusArea;
    this._feather = feather;
    this.renderTarget = new WebGLRenderTarget(1, 1, { depthBuffer: false });
    this.renderTarget.texture.name = "TiltShift.Target";
    this.uniforms.get("map").value = this.renderTarget.texture;
    this.blurPass = new TiltShiftBlurPass({
      kernelSize,
      resolutionScale,
      resolutionX,
      resolutionY,
      offset,
      rotation,
      focusArea,
      feather
    });
    const resolution = this.resolution = new Resolution(this, resolutionX, resolutionY, resolutionScale);
    resolution.addEventListener("change", (e) => this.setSize(resolution.baseWidth, resolution.baseHeight));
    this.rotation = rotation;
    this.updateParams();
  }
  /**
   * Updates the mask params.
   *
   * @private
   */
  updateParams() {
    const params = this.uniforms.get("maskParams").value;
    const x = Math.max(this.focusArea - this.feather, 0);
    params.set(this.offset - x, this.offset + x);
  }
  /**
   * The rotation of the focus area in radians.
   *
   * @type {Number}
   */
  get rotation() {
    return Math.acos(this.uniforms.get("rotation").value.x);
  }
  set rotation(value) {
    this.uniforms.get("rotation").value.set(Math.cos(value), Math.sin(value));
    this.blurPass.blurMaterial.rotation = value;
  }
  /**
   * The relative offset of the focus area.
   *
   * @type {Number}
   */
  get offset() {
    return this._offset;
  }
  set offset(value) {
    this._offset = value;
    this.blurPass.blurMaterial.offset = value;
    this.updateParams();
  }
  /**
   * The relative size of the focus area.
   *
   * @type {Number}
   */
  get focusArea() {
    return this._focusArea;
  }
  set focusArea(value) {
    this._focusArea = value;
    this.blurPass.blurMaterial.focusArea = value;
    this.updateParams();
  }
  /**
   * The softness of the focus area edges.
   *
   * @type {Number}
   */
  get feather() {
    return this._feather;
  }
  set feather(value) {
    this._feather = value;
    this.blurPass.blurMaterial.feather = value;
    this.updateParams();
  }
  /**
   * A blend bias.
   *
   * @type {Number}
   * @deprecated
   */
  get bias() {
    return 0;
  }
  set bias(value) {
  }
  /**
   * Updates this effect.
   *
   * @param {WebGLRenderer} renderer - The renderer.
   * @param {WebGLRenderTarget} inputBuffer - A frame buffer that contains the result of the previous pass.
   * @param {Number} [deltaTime] - The time between the last frame and the current one in seconds.
   */
  update(renderer, inputBuffer, deltaTime) {
    this.blurPass.render(renderer, inputBuffer, this.renderTarget);
  }
  /**
   * Updates the size of internal render targets.
   *
   * @param {Number} width - The width.
   * @param {Number} height - The height.
   */
  setSize(width, height) {
    const resolution = this.resolution;
    resolution.setBaseSize(width, height);
    this.renderTarget.setSize(resolution.width, resolution.height);
    this.blurPass.resolution.copy(resolution);
  }
  /**
   * Performs initialization tasks.
   *
   * @param {WebGLRenderer} renderer - The renderer.
   * @param {Boolean} alpha - Whether the renderer uses the alpha channel or not.
   * @param {Number} frameBufferType - The type of the main frame buffers.
   */
  initialize(renderer, alpha, frameBufferType) {
    this.blurPass.initialize(renderer, alpha, frameBufferType);
    if (frameBufferType !== void 0) {
      this.renderTarget.texture.type = frameBufferType;
      if (renderer !== null && renderer.outputColorSpace === SRGBColorSpace) {
        this.renderTarget.texture.colorSpace = SRGBColorSpace;
      }
    }
  }
};
var adaptive_luminance_default = `#include <packing>
#define packFloatToRGBA(v) packDepthToRGBA(v)
#define unpackRGBAToFloat(v) unpackRGBAToDepth(v)
uniform lowp sampler2D luminanceBuffer0;uniform lowp sampler2D luminanceBuffer1;uniform float minLuminance;uniform float deltaTime;uniform float tau;varying vec2 vUv;void main(){float l0=unpackRGBAToFloat(texture2D(luminanceBuffer0,vUv));
#if __VERSION__ < 300
float l1=texture2DLodEXT(luminanceBuffer1,vUv,MIP_LEVEL_1X1).r;
#else
float l1=textureLod(luminanceBuffer1,vUv,MIP_LEVEL_1X1).r;
#endif
l0=max(minLuminance,l0);l1=max(minLuminance,l1);float adaptedLum=l0+(l1-l0)*(1.0-exp(-deltaTime*tau));gl_FragColor=(adaptedLum==1.0)?vec4(1.0):packFloatToRGBA(adaptedLum);}`;
var AdaptiveLuminanceMaterial = class extends ShaderMaterial {
  /**
   * Constructs a new adaptive luminance material.
   */
  constructor() {
    super({
      name: "AdaptiveLuminanceMaterial",
      defines: {
        MIP_LEVEL_1X1: "0.0"
      },
      uniforms: {
        luminanceBuffer0: new Uniform(null),
        luminanceBuffer1: new Uniform(null),
        minLuminance: new Uniform(0.01),
        deltaTime: new Uniform(0),
        tau: new Uniform(1)
      },
      extensions: {
        shaderTextureLOD: true
      },
      blending: NoBlending,
      toneMapped: false,
      depthWrite: false,
      depthTest: false,
      fragmentShader: adaptive_luminance_default,
      vertexShader: common_default
    });
  }
  /**
   * The primary luminance buffer that contains the downsampled average luminance.
   *
   * @type {Texture}
   */
  set luminanceBuffer0(value) {
    this.uniforms.luminanceBuffer0.value = value;
  }
  /**
   * Sets the primary luminance buffer that contains the downsampled average luminance.
   *
   * @deprecated Use luminanceBuffer0 instead.
   * @param {Texture} value - The buffer.
   */
  setLuminanceBuffer0(value) {
    this.uniforms.luminanceBuffer0.value = value;
  }
  /**
   * The secondary luminance buffer.
   *
   * @type {Texture}
   */
  set luminanceBuffer1(value) {
    this.uniforms.luminanceBuffer1.value = value;
  }
  /**
   * Sets the secondary luminance buffer.
   *
   * @deprecated Use luminanceBuffer1 instead.
   * @param {Texture} value - The buffer.
   */
  setLuminanceBuffer1(value) {
    this.uniforms.luminanceBuffer1.value = value;
  }
  /**
   * The 1x1 mipmap level.
   *
   * This level is used to identify the smallest mipmap of the primary luminance buffer.
   *
   * @type {Number}
   */
  set mipLevel1x1(value) {
    this.defines.MIP_LEVEL_1X1 = value.toFixed(1);
    this.needsUpdate = true;
  }
  /**
   * Sets the 1x1 mipmap level.
   *
   * @deprecated Use mipLevel1x1 instead.
   * @param {Number} value - The level.
   */
  setMipLevel1x1(value) {
    this.mipLevel1x1 = value;
  }
  /**
   * The delta time.
   *
   * @type {Number}
   */
  set deltaTime(value) {
    this.uniforms.deltaTime.value = value;
  }
  /**
   * Sets the delta time.
   *
   * @deprecated Use deltaTime instead.
   * @param {Number} value - The delta time.
   */
  setDeltaTime(value) {
    this.uniforms.deltaTime.value = value;
  }
  /**
   * The lowest possible luminance value.
   *
   * @type {Number}
   */
  get minLuminance() {
    return this.uniforms.minLuminance.value;
  }
  set minLuminance(value) {
    this.uniforms.minLuminance.value = value;
  }
  /**
   * Returns the lowest possible luminance value.
   *
   * @deprecated Use minLuminance instead.
   * @return {Number} The minimum luminance.
   */
  getMinLuminance() {
    return this.uniforms.minLuminance.value;
  }
  /**
   * Sets the minimum luminance.
   *
   * @deprecated Use minLuminance instead.
   * @param {Number} value - The minimum luminance.
   */
  setMinLuminance(value) {
    this.uniforms.minLuminance.value = value;
  }
  /**
   * The luminance adaptation rate.
   *
   * @type {Number}
   */
  get adaptationRate() {
    return this.uniforms.tau.value;
  }
  set adaptationRate(value) {
    this.uniforms.tau.value = value;
  }
  /**
   * Returns the luminance adaptation rate.
   *
   * @deprecated Use adaptationRate instead.
   * @return {Number} The adaptation rate.
   */
  getAdaptationRate() {
    return this.uniforms.tau.value;
  }
  /**
   * Sets the luminance adaptation rate.
   *
   * @deprecated Use adaptationRate instead.
   * @param {Number} value - The adaptation rate.
   */
  setAdaptationRate(value) {
    this.uniforms.tau.value = value;
  }
};
var AdaptiveLuminancePass = class extends Pass {
  /**
   * Constructs a new adaptive luminance pass.
   *
   * @param {Texture} luminanceBuffer - A buffer that contains the current scene luminance.
   * @param {Object} [options] - The options.
   * @param {Number} [options.minLuminance=0.01] - The minimum luminance.
   * @param {Number} [options.adaptationRate=1.0] - The luminance adaptation rate.
   */
  constructor(luminanceBuffer, { minLuminance = 0.01, adaptationRate = 1 } = {}) {
    super("AdaptiveLuminancePass");
    this.fullscreenMaterial = new AdaptiveLuminanceMaterial();
    this.needsSwap = false;
    this.renderTargetPrevious = new WebGLRenderTarget(1, 1, {
      minFilter: NearestFilter,
      magFilter: NearestFilter,
      depthBuffer: false
    });
    this.renderTargetPrevious.texture.name = "Luminance.Previous";
    const material = this.fullscreenMaterial;
    material.luminanceBuffer0 = this.renderTargetPrevious.texture;
    material.luminanceBuffer1 = luminanceBuffer;
    material.minLuminance = minLuminance;
    material.adaptationRate = adaptationRate;
    this.renderTargetAdapted = this.renderTargetPrevious.clone();
    this.renderTargetAdapted.texture.name = "Luminance.Adapted";
    this.copyPass = new CopyPass(this.renderTargetPrevious, false);
  }
  /**
   * The adaptive luminance texture.
   *
   * @type {Texture}
   */
  get texture() {
    return this.renderTargetAdapted.texture;
  }
  /**
   * Returns the adaptive 1x1 luminance texture.
   *
   * @deprecated Use texture instead.
   * @return {Texture} The texture.
   */
  getTexture() {
    return this.renderTargetAdapted.texture;
  }
  /**
   * Sets the 1x1 mipmap level.
   *
   * This level is used to identify the smallest mipmap of the main luminance texture which contains the downsampled
   * average scene luminance.
   *
   * @type {Number}
   * @deprecated Use fullscreenMaterial.mipLevel1x1 instead.
   */
  set mipLevel1x1(value) {
    this.fullscreenMaterial.mipLevel1x1 = value;
  }
  /**
   * The luminance adaptation rate.
   *
   * @type {Number}
   * @deprecated Use fullscreenMaterial.adaptationRate instead.
   */
  get adaptationRate() {
    return this.fullscreenMaterial.adaptationRate;
  }
  /**
   * @type {Number}
   * @deprecated Use fullscreenMaterial.adaptationRate instead.
   */
  set adaptationRate(value) {
    this.fullscreenMaterial.adaptationRate = value;
  }
  /**
   * Renders the scene normals.
   *
   * @param {WebGLRenderer} renderer - The renderer.
   * @param {WebGLRenderTarget} inputBuffer - A frame buffer that contains the result of the previous pass.
   * @param {WebGLRenderTarget} outputBuffer - A frame buffer that serves as the output render target unless this pass renders to screen.
   * @param {Number} [deltaTime] - The time between the last frame and the current one in seconds.
   * @param {Boolean} [stencilTest] - Indicates whether a stencil mask is active.
   */
  render(renderer, inputBuffer, outputBuffer, deltaTime, stencilTest) {
    this.fullscreenMaterial.deltaTime = deltaTime;
    renderer.setRenderTarget(this.renderToScreen ? null : this.renderTargetAdapted);
    renderer.render(this.scene, this.camera);
    this.copyPass.render(renderer, this.renderTargetAdapted);
  }
};
var tone_mapping_default = `#include <tonemapping_pars_fragment>
uniform float whitePoint;
#if TONE_MAPPING_MODE == 2 || TONE_MAPPING_MODE == 3
uniform float middleGrey;
#if TONE_MAPPING_MODE == 3
uniform lowp sampler2D luminanceBuffer;
#else
uniform float averageLuminance;
#endif
vec3 Reinhard2ToneMapping(vec3 color){color*=toneMappingExposure;float l=luminance(color);
#if TONE_MAPPING_MODE == 3
float lumAvg=unpackRGBAToFloat(texture2D(luminanceBuffer,vec2(0.5)));
#else
float lumAvg=averageLuminance;
#endif
float lumScaled=(l*middleGrey)/max(lumAvg,1e-6);float lumCompressed=lumScaled*(1.0+lumScaled/(whitePoint*whitePoint));lumCompressed/=(1.0+lumScaled);return clamp(lumCompressed*color,0.0,1.0);}
#elif TONE_MAPPING_MODE == 4
#define A 0.15
#define B 0.50
#define C 0.10
#define D 0.20
#define E 0.02
#define F 0.30
vec3 Uncharted2Helper(const in vec3 x){return((x*(A*x+C*B)+D*E)/(x*(A*x+B)+D*F))-E/F;}vec3 Uncharted2ToneMapping(vec3 color){color*=toneMappingExposure;return clamp(Uncharted2Helper(color)/Uncharted2Helper(vec3(whitePoint)),0.0,1.0);}
#endif
void mainImage(const in vec4 inputColor,const in vec2 uv,out vec4 outputColor){
#if TONE_MAPPING_MODE == 2 || TONE_MAPPING_MODE == 3
outputColor=vec4(Reinhard2ToneMapping(inputColor.rgb),inputColor.a);
#elif TONE_MAPPING_MODE == 4
outputColor=vec4(Uncharted2ToneMapping(inputColor.rgb),inputColor.a);
#else
outputColor=vec4(toneMapping(inputColor.rgb),inputColor.a);
#endif
}`;
var ToneMappingEffect = class extends Effect {
  /**
   * Constructs a new tone mapping effect.
   *
   * The additional parameters only affect the Reinhard2 operator.
   *
   * @param {Object} [options] - The options.
   * @param {BlendFunction} [options.blendFunction=BlendFunction.SRC] - The blend function of this effect.
   * @param {Boolean} [options.adaptive=false] - Deprecated. Use mode instead.
   * @param {ToneMappingMode} [options.mode=ToneMappingMode.AGX] - The tone mapping mode.
   * @param {Number} [options.resolution=256] - The resolution of the luminance texture. Must be a power of two.
   * @param {Number} [options.maxLuminance=4.0] - Deprecated. Same as whitePoint.
   * @param {Number} [options.whitePoint=4.0] - The white point.
   * @param {Number} [options.middleGrey=0.6] - The middle grey factor.
   * @param {Number} [options.minLuminance=0.01] - The minimum luminance. Prevents very high exposure in dark scenes.
   * @param {Number} [options.averageLuminance=1.0] - The average luminance. Used for the non-adaptive Reinhard operator.
   * @param {Number} [options.adaptationRate=1.0] - The luminance adaptation rate.
   */
  constructor({
    blendFunction = BlendFunction.SRC,
    adaptive = false,
    mode = adaptive ? ToneMappingMode.REINHARD2_ADAPTIVE : ToneMappingMode.AGX,
    resolution = 256,
    maxLuminance = 4,
    whitePoint = maxLuminance,
    middleGrey = 0.6,
    minLuminance = 0.01,
    averageLuminance = 1,
    adaptationRate = 1
  } = {}) {
    super("ToneMappingEffect", tone_mapping_default, {
      blendFunction,
      uniforms: /* @__PURE__ */ new Map([
        ["luminanceBuffer", new Uniform(null)],
        ["maxLuminance", new Uniform(maxLuminance)],
        // Unused
        ["whitePoint", new Uniform(whitePoint)],
        ["middleGrey", new Uniform(middleGrey)],
        ["averageLuminance", new Uniform(averageLuminance)]
      ])
    });
    this.renderTargetLuminance = new WebGLRenderTarget(1, 1, {
      minFilter: LinearMipmapLinearFilter,
      depthBuffer: false
    });
    this.renderTargetLuminance.texture.generateMipmaps = true;
    this.renderTargetLuminance.texture.name = "Luminance";
    this.luminancePass = new LuminancePass({
      renderTarget: this.renderTargetLuminance
    });
    this.adaptiveLuminancePass = new AdaptiveLuminancePass(this.luminancePass.texture, {
      minLuminance,
      adaptationRate
    });
    this.uniforms.get("luminanceBuffer").value = this.adaptiveLuminancePass.texture;
    this.resolution = resolution;
    this.mode = mode;
  }
  /**
   * The tone mapping mode.
   *
   * @type {ToneMappingMode}
   */
  get mode() {
    return Number(this.defines.get("TONE_MAPPING_MODE"));
  }
  set mode(value) {
    if (this.mode === value) {
      return;
    }
    const revision = REVISION.replace(/\D+/g, "");
    const cineonToneMapping = revision >= 168 ? "CineonToneMapping(texel)" : "OptimizedCineonToneMapping(texel)";
    this.defines.clear();
    this.defines.set("TONE_MAPPING_MODE", value.toFixed(0));
    switch (value) {
      case ToneMappingMode.LINEAR:
        this.defines.set("toneMapping(texel)", "LinearToneMapping(texel)");
        break;
      case ToneMappingMode.REINHARD:
        this.defines.set("toneMapping(texel)", "ReinhardToneMapping(texel)");
        break;
      case ToneMappingMode.CINEON:
      case ToneMappingMode.OPTIMIZED_CINEON:
        this.defines.set("toneMapping(texel)", cineonToneMapping);
        break;
      case ToneMappingMode.ACES_FILMIC:
        this.defines.set("toneMapping(texel)", "ACESFilmicToneMapping(texel)");
        break;
      case ToneMappingMode.AGX:
        this.defines.set("toneMapping(texel)", "AgXToneMapping(texel)");
        break;
      case ToneMappingMode.NEUTRAL:
        this.defines.set("toneMapping(texel)", "NeutralToneMapping(texel)");
        break;
      default:
        this.defines.set("toneMapping(texel)", "texel");
        break;
    }
    this.adaptiveLuminancePass.enabled = value === ToneMappingMode.REINHARD2_ADAPTIVE;
    this.setChanged();
  }
  /**
   * Returns the current tone mapping mode.
   *
   * @deprecated Use mode instead.
   * @return {ToneMappingMode} The tone mapping mode.
   */
  getMode() {
    return this.mode;
  }
  /**
   * Sets the tone mapping mode.
   *
   * @deprecated Use mode instead.
   * @param {ToneMappingMode} value - The tone mapping mode.
   */
  setMode(value) {
    this.mode = value;
  }
  /**
   * The white point. Default is `4.0`.
   *
   * Only applies to Reinhard2 (Modified & Adaptive).
   *
   * @type {Number}
   */
  get whitePoint() {
    return this.uniforms.get("whitePoint").value;
  }
  set whitePoint(value) {
    this.uniforms.get("whitePoint").value = value;
  }
  /**
   * The middle grey factor. Default is `0.6`.
   *
   * Only applies to Reinhard2 (Modified & Adaptive).
   *
   * @type {Number}
   */
  get middleGrey() {
    return this.uniforms.get("middleGrey").value;
  }
  set middleGrey(value) {
    this.uniforms.get("middleGrey").value = value;
  }
  /**
   * The average luminance.
   *
   * Only applies to Reinhard2 (Modified).
   *
   * @type {Number}
   */
  get averageLuminance() {
    return this.uniforms.get("averageLuminance").value;
  }
  set averageLuminance(value) {
    this.uniforms.get("averageLuminance").value = value;
  }
  /**
   * The adaptive luminance material.
   *
   * @type {AdaptiveLuminanceMaterial}
   */
  get adaptiveLuminanceMaterial() {
    return this.adaptiveLuminancePass.fullscreenMaterial;
  }
  /**
   * Returns the adaptive luminance material.
   *
   * @deprecated Use adaptiveLuminanceMaterial instead.
   * @return {AdaptiveLuminanceMaterial} The material.
   */
  getAdaptiveLuminanceMaterial() {
    return this.adaptiveLuminanceMaterial;
  }
  /**
   * The resolution of the luminance texture. Must be a power of two.
   *
   * @type {Number}
   */
  get resolution() {
    return this.luminancePass.resolution.width;
  }
  set resolution(value) {
    const exponent = Math.max(0, Math.ceil(Math.log2(value)));
    const size = Math.pow(2, exponent);
    this.luminancePass.resolution.setPreferredSize(size, size);
    this.adaptiveLuminanceMaterial.mipLevel1x1 = exponent;
  }
  /**
   * Returns the resolution of the luminance texture.
   *
   * @deprecated Use resolution instead.
   * @return {Number} The resolution.
   */
  getResolution() {
    return this.resolution;
  }
  /**
   * Sets the resolution of the luminance texture. Must be a power of two.
   *
   * @deprecated Use resolution instead.
   * @param {Number} value - The resolution.
   */
  setResolution(value) {
    this.resolution = value;
  }
  /**
   * Indicates whether this pass uses adaptive luminance.
   *
   * @type {Boolean}
   * @deprecated Use mode instead.
   */
  get adaptive() {
    return this.mode === ToneMappingMode.REINHARD2_ADAPTIVE;
  }
  set adaptive(value) {
    this.mode = value ? ToneMappingMode.REINHARD2_ADAPTIVE : ToneMappingMode.REINHARD2;
  }
  /**
   * The luminance adaptation rate.
   *
   * @type {Number}
   * @deprecated Use adaptiveLuminanceMaterial.adaptationRate instead.
   */
  get adaptationRate() {
    return this.adaptiveLuminanceMaterial.adaptationRate;
  }
  set adaptationRate(value) {
    this.adaptiveLuminanceMaterial.adaptationRate = value;
  }
  /**
   * @type {Number}
   * @deprecated
   */
  get distinction() {
    console.warn(this.name, "distinction was removed.");
    return 1;
  }
  set distinction(value) {
    console.warn(this.name, "distinction was removed.");
  }
  /**
   * Updates this effect.
   *
   * @param {WebGLRenderer} renderer - The renderer.
   * @param {WebGLRenderTarget} inputBuffer - A frame buffer that contains the result of the previous pass.
   * @param {Number} [deltaTime] - The time between the last frame and the current one in seconds.
   */
  update(renderer, inputBuffer, deltaTime) {
    if (this.adaptiveLuminancePass.enabled) {
      this.luminancePass.render(renderer, inputBuffer);
      this.adaptiveLuminancePass.render(renderer, null, null, deltaTime);
    }
  }
  /**
   * Performs initialization tasks.
   *
   * @param {WebGLRenderer} renderer - The renderer.
   * @param {Boolean} alpha - Whether the renderer uses the alpha channel or not.
   * @param {Number} frameBufferType - The type of the main frame buffers.
   */
  initialize(renderer, alpha, frameBufferType) {
    this.adaptiveLuminancePass.initialize(renderer, alpha, frameBufferType);
  }
};
var vignette_default = `uniform float offset;uniform float darkness;void mainImage(const in vec4 inputColor,const in vec2 uv,out vec4 outputColor){const vec2 center=vec2(0.5);vec3 color=inputColor.rgb;
#if VIGNETTE_TECHNIQUE == 0
float d=distance(uv,center);color*=smoothstep(0.8,offset*0.799,d*(darkness+offset));
#else
vec2 coord=(uv-center)*vec2(offset);color=mix(color,vec3(1.0-darkness),dot(coord,coord));
#endif
outputColor=vec4(color,inputColor.a);}`;
var VignetteEffect = class extends Effect {
  /**
   * Constructs a new Vignette effect.
   *
   * @param {Object} [options] - The options.
   * @param {BlendFunction} [options.blendFunction] - The blend function of this effect.
   * @param {VignetteTechnique} [options.technique=VignetteTechnique.DEFAULT] - The Vignette technique.
   * @param {Boolean} [options.eskil=false] - Deprecated. Use technique instead.
   * @param {Number} [options.offset=0.5] - The Vignette offset.
   * @param {Number} [options.darkness=0.5] - The Vignette darkness.
   */
  constructor({
    blendFunction,
    eskil = false,
    technique = eskil ? VignetteTechnique.ESKIL : VignetteTechnique.DEFAULT,
    offset = 0.5,
    darkness = 0.5
  } = {}) {
    super("VignetteEffect", vignette_default, {
      blendFunction,
      defines: /* @__PURE__ */ new Map([
        ["VIGNETTE_TECHNIQUE", technique.toFixed(0)]
      ]),
      uniforms: /* @__PURE__ */ new Map([
        ["offset", new Uniform(offset)],
        ["darkness", new Uniform(darkness)]
      ])
    });
  }
  /**
   * The Vignette technique.
   *
   * @type {VignetteTechnique}
   */
  get technique() {
    return Number(this.defines.get("VIGNETTE_TECHNIQUE"));
  }
  set technique(value) {
    if (this.technique !== value) {
      this.defines.set("VIGNETTE_TECHNIQUE", value.toFixed(0));
      this.setChanged();
    }
  }
  /**
   * Indicates whether Eskil's Vignette technique is enabled.
   *
   * @type {Boolean}
   * @deprecated Use technique instead.
   */
  get eskil() {
    return this.technique === VignetteTechnique.ESKIL;
  }
  /**
   * Indicates whether Eskil's Vignette technique is enabled.
   *
   * @type {Boolean}
   * @deprecated Use technique instead.
   */
  set eskil(value) {
    this.technique = value ? VignetteTechnique.ESKIL : VignetteTechnique.DEFAULT;
  }
  /**
   * Returns the Vignette technique.
   *
   * @deprecated Use technique instead.
   * @return {VignetteTechnique} The technique.
   */
  getTechnique() {
    return this.technique;
  }
  /**
   * Sets the Vignette technique.
   *
   * @deprecated Use technique instead.
   * @param {VignetteTechnique} value - The technique.
   */
  setTechnique(value) {
    this.technique = value;
  }
  /**
   * The Vignette offset.
   *
   * @type {Number}
   */
  get offset() {
    return this.uniforms.get("offset").value;
  }
  set offset(value) {
    this.uniforms.get("offset").value = value;
  }
  /**
   * Returns the Vignette offset.
   *
   * @deprecated Use offset instead.
   * @return {Number} The offset.
   */
  getOffset() {
    return this.offset;
  }
  /**
   * Sets the Vignette offset.
   *
   * @deprecated Use offset instead.
   * @param {Number} value - The offset.
   */
  setOffset(value) {
    this.offset = value;
  }
  /**
   * The Vignette darkness.
   *
   * @type {Number}
   */
  get darkness() {
    return this.uniforms.get("darkness").value;
  }
  set darkness(value) {
    this.uniforms.get("darkness").value = value;
  }
  /**
   * Returns the Vignette darkness.
   *
   * @deprecated Use darkness instead.
   * @return {Number} The darkness.
   */
  getDarkness() {
    return this.darkness;
  }
  /**
   * Sets the Vignette darkness.
   *
   * @deprecated Use darkness instead.
   * @param {Number} value - The darkness.
   */
  setDarkness(value) {
    this.darkness = value;
  }
};
var depth_copy_default = `#include <packing>
varying vec2 vUv;
#ifdef NORMAL_DEPTH
#ifdef GL_FRAGMENT_PRECISION_HIGH
uniform highp sampler2D normalDepthBuffer;
#else
uniform mediump sampler2D normalDepthBuffer;
#endif
float readDepth(const in vec2 uv){return texture2D(normalDepthBuffer,uv).a;}
#else
#if INPUT_DEPTH_PACKING == 3201
uniform lowp sampler2D depthBuffer;
#elif defined(GL_FRAGMENT_PRECISION_HIGH)
uniform highp sampler2D depthBuffer;
#else
uniform mediump sampler2D depthBuffer;
#endif
float readDepth(const in vec2 uv){
#if INPUT_DEPTH_PACKING == 3201
return unpackRGBAToDepth(texture2D(depthBuffer,uv));
#else
return texture2D(depthBuffer,uv).r;
#endif
}
#endif
void main(){
#if INPUT_DEPTH_PACKING == OUTPUT_DEPTH_PACKING
gl_FragColor=texture2D(depthBuffer,vUv);
#else
float depth=readDepth(vUv);
#if OUTPUT_DEPTH_PACKING == 3201
gl_FragColor=(depth==1.0)?vec4(1.0):packDepthToRGBA(depth);
#else
gl_FragColor=vec4(vec3(depth),1.0);
#endif
#endif
}`;
var depth_copy_default2 = `varying vec2 vUv;
#if DEPTH_COPY_MODE == 1
uniform vec2 texelPosition;
#endif
void main(){
#if DEPTH_COPY_MODE == 1
vUv=texelPosition;
#else
vUv=position.xy*0.5+0.5;
#endif
gl_Position=vec4(position.xy,1.0,1.0);}`;
var DepthCopyMaterial = class extends ShaderMaterial {
  /**
   * Constructs a new depth copy material.
   */
  constructor() {
    super({
      name: "DepthCopyMaterial",
      defines: {
        INPUT_DEPTH_PACKING: "0",
        OUTPUT_DEPTH_PACKING: "0",
        DEPTH_COPY_MODE: "0"
      },
      uniforms: {
        depthBuffer: new Uniform(null),
        texelPosition: new Uniform(new Vector2())
      },
      blending: NoBlending,
      toneMapped: false,
      depthWrite: false,
      depthTest: false,
      fragmentShader: depth_copy_default,
      vertexShader: depth_copy_default2
    });
    this.depthCopyMode = DepthCopyMode.FULL;
  }
  /**
   * The input depth buffer.
   *
   * @type {Texture}
   */
  get depthBuffer() {
    return this.uniforms.depthBuffer.value;
  }
  set depthBuffer(value) {
    this.uniforms.depthBuffer.value = value;
  }
  /**
   * The input depth packing strategy.
   *
   * @type {DepthPackingStrategies}
   */
  set inputDepthPacking(value) {
    this.defines.INPUT_DEPTH_PACKING = value.toFixed(0);
    this.needsUpdate = true;
  }
  /**
   * The output depth packing strategy.
   *
   * @type {DepthPackingStrategies}
   */
  get outputDepthPacking() {
    return Number(this.defines.OUTPUT_DEPTH_PACKING);
  }
  set outputDepthPacking(value) {
    this.defines.OUTPUT_DEPTH_PACKING = value.toFixed(0);
    this.needsUpdate = true;
  }
  /**
   * Sets the input depth buffer.
   *
   * @deprecated Use depthBuffer and inputDepthPacking instead.
   * @param {Texture} buffer - The depth texture.
   * @param {DepthPackingStrategies} [depthPacking=BasicDepthPacking] - The depth packing strategy.
   */
  setDepthBuffer(buffer2, depthPacking = BasicDepthPacking) {
    this.depthBuffer = buffer2;
    this.inputDepthPacking = depthPacking;
  }
  /**
   * Returns the current input depth packing strategy.
   *
   * @deprecated
   * @return {DepthPackingStrategies} The input depth packing strategy.
   */
  getInputDepthPacking() {
    return Number(this.defines.INPUT_DEPTH_PACKING);
  }
  /**
   * Sets the input depth packing strategy.
   *
   * @deprecated Use inputDepthPacking instead.
   * @param {DepthPackingStrategies} value - The new input depth packing strategy.
   */
  setInputDepthPacking(value) {
    this.defines.INPUT_DEPTH_PACKING = value.toFixed(0);
    this.needsUpdate = true;
  }
  /**
   * Returns the current output depth packing strategy.
   *
   * @deprecated Use outputDepthPacking instead.
   * @return {DepthPackingStrategies} The output depth packing strategy.
   */
  getOutputDepthPacking() {
    return Number(this.defines.OUTPUT_DEPTH_PACKING);
  }
  /**
   * Sets the output depth packing strategy.
   *
   * @deprecated Use outputDepthPacking instead.
   * @param {DepthPackingStrategies} value - The new output depth packing strategy.
   */
  setOutputDepthPacking(value) {
    this.defines.OUTPUT_DEPTH_PACKING = value.toFixed(0);
    this.needsUpdate = true;
  }
  /**
   * The screen space position used for single-texel copy operations.
   *
   * @type {Vector2}
   */
  get texelPosition() {
    return this.uniforms.texelPosition.value;
  }
  /**
   * Returns the screen space position used for single-texel copy operations.
   *
   * @deprecated Use texelPosition instead.
   * @return {Vector2} The position.
   */
  getTexelPosition() {
    return this.uniforms.texelPosition.value;
  }
  /**
   * Sets the screen space position used for single-texel copy operations.
   *
   * @deprecated
   * @param {Vector2} value - The position.
   */
  setTexelPosition(value) {
    this.uniforms.texelPosition.value = value;
  }
  /**
   * The depth copy mode.
   *
   * @type {DepthCopyMode}
   */
  get mode() {
    return this.depthCopyMode;
  }
  set mode(value) {
    this.depthCopyMode = value;
    this.defines.DEPTH_COPY_MODE = value.toFixed(0);
    this.needsUpdate = true;
  }
  /**
   * Returns the depth copy mode.
   *
   * @deprecated Use mode instead.
   * @return {DepthCopyMode} The depth copy mode.
   */
  getMode() {
    return this.mode;
  }
  /**
   * Sets the depth copy mode.
   *
   * @deprecated Use mode instead.
   * @param {DepthCopyMode} value - The new mode.
   */
  setMode(value) {
    this.mode = value;
  }
};
var effect_default = `#include <common>
#include <packing>
#include <dithering_pars_fragment>
#define packFloatToRGBA(v) packDepthToRGBA(v)
#define unpackRGBAToFloat(v) unpackRGBAToDepth(v)
#ifdef FRAMEBUFFER_PRECISION_HIGH
uniform mediump sampler2D inputBuffer;
#else
uniform lowp sampler2D inputBuffer;
#endif
#if DEPTH_PACKING == 3201
uniform lowp sampler2D depthBuffer;
#elif defined(GL_FRAGMENT_PRECISION_HIGH)
uniform highp sampler2D depthBuffer;
#else
uniform mediump sampler2D depthBuffer;
#endif
uniform vec2 resolution;uniform vec2 texelSize;uniform float cameraNear;uniform float cameraFar;uniform float aspect;uniform float time;varying vec2 vUv;vec4 sRGBToLinear(const in vec4 value){return vec4(mix(pow(value.rgb*0.9478672986+vec3(0.0521327014),vec3(2.4)),value.rgb*0.0773993808,vec3(lessThanEqual(value.rgb,vec3(0.04045)))),value.a);}float readDepth(const in vec2 uv){
#if DEPTH_PACKING == 3201
return unpackRGBAToDepth(texture2D(depthBuffer,uv));
#else
return texture2D(depthBuffer,uv).r;
#endif
}float getViewZ(const in float depth){
#ifdef PERSPECTIVE_CAMERA
return perspectiveDepthToViewZ(depth,cameraNear,cameraFar);
#else
return orthographicDepthToViewZ(depth,cameraNear,cameraFar);
#endif
}vec3 RGBToHCV(const in vec3 RGB){vec4 P=mix(vec4(RGB.bg,-1.0,2.0/3.0),vec4(RGB.gb,0.0,-1.0/3.0),step(RGB.b,RGB.g));vec4 Q=mix(vec4(P.xyw,RGB.r),vec4(RGB.r,P.yzx),step(P.x,RGB.r));float C=Q.x-min(Q.w,Q.y);float H=abs((Q.w-Q.y)/(6.0*C+EPSILON)+Q.z);return vec3(H,C,Q.x);}vec3 RGBToHSL(const in vec3 RGB){vec3 HCV=RGBToHCV(RGB);float L=HCV.z-HCV.y*0.5;float S=HCV.y/(1.0-abs(L*2.0-1.0)+EPSILON);return vec3(HCV.x,S,L);}vec3 HueToRGB(const in float H){float R=abs(H*6.0-3.0)-1.0;float G=2.0-abs(H*6.0-2.0);float B=2.0-abs(H*6.0-4.0);return clamp(vec3(R,G,B),0.0,1.0);}vec3 HSLToRGB(const in vec3 HSL){vec3 RGB=HueToRGB(HSL.x);float C=(1.0-abs(2.0*HSL.z-1.0))*HSL.y;return(RGB-0.5)*C+HSL.z;}FRAGMENT_HEAD void main(){FRAGMENT_MAIN_UV vec4 color0=texture2D(inputBuffer,UV);vec4 color1=vec4(0.0);FRAGMENT_MAIN_IMAGE color0.a=clamp(color0.a,0.0,1.0);gl_FragColor=color0;
#ifdef ENCODE_OUTPUT
#include <colorspace_fragment>
#endif
#include <dithering_fragment>
}`;
var effect_default2 = `uniform vec2 resolution;uniform vec2 texelSize;uniform float cameraNear;uniform float cameraFar;uniform float aspect;uniform float time;varying vec2 vUv;VERTEX_HEAD void main(){vUv=position.xy*0.5+0.5;VERTEX_MAIN_SUPPORT gl_Position=vec4(position.xy,1.0,1.0);}`;
var EffectMaterial = class extends ShaderMaterial {
  /**
   * Constructs a new effect material.
   *
   * @param {Map<String, String>} [shaderParts] - Deprecated. Use setShaderData instead.
   * @param {Map<String, String>} [defines] - Deprecated. Use setShaderData instead.
   * @param {Map<String, Uniform>} [uniforms] - Deprecated. Use setShaderData instead.
   * @param {Camera} [camera] - A camera.
   * @param {Boolean} [dithering=false] - Deprecated.
   */
  constructor(shaderParts, defines, uniforms, camera, dithering = false) {
    super({
      name: "EffectMaterial",
      defines: {
        THREE_REVISION: REVISION.replace(/\D+/g, ""),
        DEPTH_PACKING: "0",
        ENCODE_OUTPUT: "1"
      },
      uniforms: {
        inputBuffer: new Uniform(null),
        depthBuffer: new Uniform(null),
        resolution: new Uniform(new Vector2()),
        texelSize: new Uniform(new Vector2()),
        cameraNear: new Uniform(0.3),
        cameraFar: new Uniform(1e3),
        aspect: new Uniform(1),
        time: new Uniform(0)
      },
      blending: NoBlending,
      toneMapped: false,
      depthWrite: false,
      depthTest: false,
      dithering
    });
    if (shaderParts) {
      this.setShaderParts(shaderParts);
    }
    if (defines) {
      this.setDefines(defines);
    }
    if (uniforms) {
      this.setUniforms(uniforms);
    }
    this.copyCameraSettings(camera);
  }
  /**
   * The input buffer.
   *
   * @type {Texture}
   */
  set inputBuffer(value) {
    this.uniforms.inputBuffer.value = value;
  }
  /**
   * Sets the input buffer.
   *
   * @deprecated Use inputBuffer instead.
   * @param {Texture} value - The input buffer.
   */
  setInputBuffer(value) {
    this.uniforms.inputBuffer.value = value;
  }
  /**
   * The depth buffer.
   *
   * @type {Texture}
   */
  get depthBuffer() {
    return this.uniforms.depthBuffer.value;
  }
  set depthBuffer(value) {
    this.uniforms.depthBuffer.value = value;
  }
  /**
   * The depth packing strategy.
   *
   * @type {DepthPackingStrategies}
   */
  get depthPacking() {
    return Number(this.defines.DEPTH_PACKING);
  }
  set depthPacking(value) {
    this.defines.DEPTH_PACKING = value.toFixed(0);
    this.needsUpdate = true;
  }
  /**
   * Sets the depth buffer.
   *
   * @deprecated Use depthBuffer and depthPacking instead.
   * @param {Texture} buffer - The depth texture.
   * @param {DepthPackingStrategies} [depthPacking=BasicDepthPacking] - The depth packing strategy.
   */
  setDepthBuffer(buffer2, depthPacking = BasicDepthPacking) {
    this.depthBuffer = buffer2;
    this.depthPacking = depthPacking;
  }
  /**
   * Sets the shader data.
   *
   * @param {EffectShaderData} data - The shader data.
   * @return {EffectMaterial} This material.
   */
  setShaderData(data) {
    this.setShaderParts(data.shaderParts);
    this.setDefines(data.defines);
    this.setUniforms(data.uniforms);
    this.setExtensions(data.extensions);
  }
  /**
   * Sets the shader parts.
   *
   * @deprecated Use setShaderData instead.
   * @param {Map<String, String>} shaderParts - A collection of shader snippets. See {@link EffectShaderSection}.
   * @return {EffectMaterial} This material.
   */
  setShaderParts(shaderParts) {
    this.fragmentShader = effect_default.replace(EffectShaderSection.FRAGMENT_HEAD, shaderParts.get(EffectShaderSection.FRAGMENT_HEAD) || "").replace(EffectShaderSection.FRAGMENT_MAIN_UV, shaderParts.get(EffectShaderSection.FRAGMENT_MAIN_UV) || "").replace(EffectShaderSection.FRAGMENT_MAIN_IMAGE, shaderParts.get(EffectShaderSection.FRAGMENT_MAIN_IMAGE) || "");
    this.vertexShader = effect_default2.replace(EffectShaderSection.VERTEX_HEAD, shaderParts.get(EffectShaderSection.VERTEX_HEAD) || "").replace(EffectShaderSection.VERTEX_MAIN_SUPPORT, shaderParts.get(EffectShaderSection.VERTEX_MAIN_SUPPORT) || "");
    this.needsUpdate = true;
    return this;
  }
  /**
   * Sets the shader macros.
   *
   * @deprecated Use setShaderData instead.
   * @param {Map<String, String>} defines - A collection of preprocessor macro definitions.
   * @return {EffectMaterial} This material.
   */
  setDefines(defines) {
    for (const entry of defines.entries()) {
      this.defines[entry[0]] = entry[1];
    }
    this.needsUpdate = true;
    return this;
  }
  /**
   * Sets the shader uniforms.
   *
   * @deprecated Use setShaderData instead.
   * @param {Map<String, Uniform>} uniforms - A collection of uniforms.
   * @return {EffectMaterial} This material.
   */
  setUniforms(uniforms) {
    for (const entry of uniforms.entries()) {
      this.uniforms[entry[0]] = entry[1];
    }
    return this;
  }
  /**
   * Sets the required shader extensions.
   *
   * @deprecated Use setShaderData instead.
   * @param {Set<WebGLExtension>} extensions - A collection of extensions.
   * @return {EffectMaterial} This material.
   */
  setExtensions(extensions) {
    this.extensions = {};
    for (const extension of extensions) {
      this.extensions[extension] = true;
    }
    return this;
  }
  /**
   * Indicates whether output encoding is enabled.
   *
   * @type {Boolean}
   */
  get encodeOutput() {
    return this.defines.ENCODE_OUTPUT !== void 0;
  }
  set encodeOutput(value) {
    if (this.encodeOutput !== value) {
      if (value) {
        this.defines.ENCODE_OUTPUT = "1";
      } else {
        delete this.defines.ENCODE_OUTPUT;
      }
      this.needsUpdate = true;
    }
  }
  /**
   * Indicates whether output encoding is enabled.
   *
   * @deprecated Use encodeOutput instead.
   * @return {Boolean} Whether output encoding is enabled.
   */
  isOutputEncodingEnabled(value) {
    return this.encodeOutput;
  }
  /**
   * Enables or disables output encoding.
   *
   * @deprecated Use encodeOutput instead.
   * @param {Boolean} value - Whether output encoding should be enabled.
   */
  setOutputEncodingEnabled(value) {
    this.encodeOutput = value;
  }
  /**
   * The time in seconds.
   *
   * @type {Number}
   */
  get time() {
    return this.uniforms.time.value;
  }
  set time(value) {
    this.uniforms.time.value = value;
  }
  /**
   * Sets the delta time.
   *
   * @deprecated Use time instead.
   * @param {Number} value - The delta time in seconds.
   */
  setDeltaTime(value) {
    this.uniforms.time.value += value;
  }
  /**
   * Copies the settings of the given camera.
   *
   * @deprecated Use copyCameraSettings instead.
   * @param {Camera} camera - A camera.
   */
  adoptCameraSettings(camera) {
    this.copyCameraSettings(camera);
  }
  /**
   * Copies the settings of the given camera.
   *
   * @param {Camera} camera - A camera.
   */
  copyCameraSettings(camera) {
    if (camera) {
      this.uniforms.cameraNear.value = camera.near;
      this.uniforms.cameraFar.value = camera.far;
      if (camera instanceof PerspectiveCamera) {
        this.defines.PERSPECTIVE_CAMERA = "1";
      } else {
        delete this.defines.PERSPECTIVE_CAMERA;
      }
      this.needsUpdate = true;
    }
  }
  /**
   * Sets the resolution.
   *
   * @param {Number} width - The width.
   * @param {Number} height - The height.
   */
  setSize(width, height) {
    const uniforms = this.uniforms;
    uniforms.resolution.value.set(width, height);
    uniforms.texelSize.value.set(1 / width, 1 / height);
    uniforms.aspect.value = width / height;
  }
  /**
   * An enumeration of shader code placeholders.
   *
   * @deprecated Use EffectShaderSection instead.
   * @type {Object}
   */
  static get Section() {
    return EffectShaderSection;
  }
};
var DepthCopyPass = class extends Pass {
  /**
   * Constructs a new depth save pass.
   *
   * @param {Object} [options] - The options.
   * @param {DepthPackingStrategies} [options.depthPacking=RGBADepthPacking] - The output depth packing.
   */
  constructor({ depthPacking = RGBADepthPacking } = {}) {
    super("DepthCopyPass");
    const material = new DepthCopyMaterial();
    material.outputDepthPacking = depthPacking;
    this.fullscreenMaterial = material;
    this.needsDepthTexture = true;
    this.needsSwap = false;
    this.renderTarget = new WebGLRenderTarget(1, 1, {
      type: depthPacking === RGBADepthPacking ? UnsignedByteType : FloatType,
      minFilter: NearestFilter,
      magFilter: NearestFilter,
      depthBuffer: false
    });
    this.renderTarget.texture.name = "DepthCopyPass.Target";
  }
  /**
   * The output depth texture.
   *
   * @type {Texture}
   */
  get texture() {
    return this.renderTarget.texture;
  }
  /**
   * Returns the output depth texture.
   *
   * @deprecated Use texture instead.
   * @return {Texture} The texture.
   */
  getTexture() {
    return this.renderTarget.texture;
  }
  /**
   * The output depth packing.
   *
   * @type {DepthPackingStrategies}
   */
  get depthPacking() {
    return this.fullscreenMaterial.outputDepthPacking;
  }
  /**
   * Returns the output depth packing.
   *
   * @deprecated Use depthPacking instead.
   * @return {DepthPackingStrategies} The depth packing.
   */
  getDepthPacking() {
    return this.fullscreenMaterial.outputDepthPacking;
  }
  /**
   * Sets the depth texture.
   *
   * @param {Texture} depthTexture - A depth texture.
   * @param {DepthPackingStrategies} [depthPacking=BasicDepthPacking] - The depth packing.
   */
  setDepthTexture(depthTexture, depthPacking = BasicDepthPacking) {
    this.fullscreenMaterial.depthBuffer = depthTexture;
    this.fullscreenMaterial.inputDepthPacking = depthPacking;
  }
  /**
   * Copies depth from a depth texture.
   *
   * @param {WebGLRenderer} renderer - The renderer.
   * @param {WebGLRenderTarget} inputBuffer - A frame buffer that contains the result of the previous pass.
   * @param {WebGLRenderTarget} outputBuffer - A frame buffer that serves as the output render target unless this pass renders to screen.
   * @param {Number} [deltaTime] - The time between the last frame and the current one in seconds.
   * @param {Boolean} [stencilTest] - Indicates whether a stencil mask is active.
   */
  render(renderer, inputBuffer, outputBuffer, deltaTime, stencilTest) {
    renderer.setRenderTarget(this.renderToScreen ? null : this.renderTarget);
    renderer.render(this.scene, this.camera);
  }
  /**
   * Updates the size of this pass.
   *
   * @param {Number} width - The width.
   * @param {Number} height - The height.
   */
  setSize(width, height) {
    this.renderTarget.setSize(width, height);
  }
};
var threeRevision = Number(REVISION.replace(/\D+/g, ""));
var unpackDownscale = 255 / 256;
var unpackFactorsLegacy = new Float32Array([
  unpackDownscale / 256 ** 3,
  unpackDownscale / 256 ** 2,
  unpackDownscale / 256,
  unpackDownscale
]);
var unpackFactors = new Float32Array([
  unpackDownscale,
  unpackDownscale / 256,
  unpackDownscale / 256 ** 2,
  1 / 256 ** 3
]);
function unpackRGBAToDepth(packedDepth) {
  const f = threeRevision >= 167 ? unpackFactors : unpackFactorsLegacy;
  return (packedDepth[0] * f[0] + packedDepth[1] * f[1] + packedDepth[2] * f[2] + packedDepth[3] * f[3]) / 255;
}
var DepthPickingPass = class extends DepthCopyPass {
  /**
   * Constructs a new depth picking pass.
   *
   * @param {Object} [options] - The options.
   * @param {DepthPackingStrategies} [options.depthPacking=RGBADepthPacking] - The depth packing.
   * @param {Number} [options.mode=DepthCopyMode.SINGLE] - The depth copy mode.
   */
  constructor({ depthPacking = RGBADepthPacking, mode = DepthCopyMode.SINGLE } = {}) {
    if (depthPacking !== RGBADepthPacking && depthPacking !== BasicDepthPacking) {
      throw new Error(`Unsupported depth packing: ${depthPacking}`);
    }
    super({ depthPacking });
    this.name = "DepthPickingPass";
    this.fullscreenMaterial.mode = mode;
    this.pixelBuffer = depthPacking === RGBADepthPacking ? new Uint8Array(4) : new Float32Array(4);
    this.callback = null;
  }
  /**
   * Reads depth at a specific screen position.
   *
   * Only one depth value can be picked per frame. Calling this method multiple times per frame will overwrite the
   * picking coordinates. Unresolved promises will be abandoned.
   *
   * @example
   * const ndc = new Vector3();
   * const clientRect = myViewport.getBoundingClientRect();
   * const clientX = pointerEvent.clientX - clientRect.left;
   * const clientY = pointerEvent.clientY - clientRect.top;
   * ndc.x = (clientX / myViewport.clientWidth) * 2.0 - 1.0;
   * ndc.y = -(clientY / myViewport.clientHeight) * 2.0 + 1.0;
   * const depth = await depthPickingPass.readDepth(ndc);
   * ndc.z = depth * 2.0 - 1.0;
   *
   * const worldPosition = ndc.unproject(camera);
   *
   * @param {Vector2|Vector3} ndc - Normalized device coordinates. Only X and Y are relevant.
   * @return {Promise<Number>} A promise that returns the depth on the next frame.
   */
  readDepth(ndc) {
    this.fullscreenMaterial.texelPosition.set(ndc.x * 0.5 + 0.5, ndc.y * 0.5 + 0.5);
    return new Promise((resolve) => {
      this.callback = resolve;
    });
  }
  /**
   * Copies depth and resolves depth picking promises.
   *
   * @param {WebGLRenderer} renderer - The renderer.
   * @param {WebGLRenderTarget} inputBuffer - A frame buffer that contains the result of the previous pass.
   * @param {WebGLRenderTarget} outputBuffer - A frame buffer that serves as the output render target unless this pass renders to screen.
   * @param {Number} [deltaTime] - The time between the last frame and the current one in seconds.
   * @param {Boolean} [stencilTest] - Indicates whether a stencil mask is active.
   */
  render(renderer, inputBuffer, outputBuffer, deltaTime, stencilTest) {
    const material = this.fullscreenMaterial;
    const mode = material.mode;
    if (mode === DepthCopyMode.FULL) {
      super.render(renderer);
    }
    if (this.callback !== null) {
      const renderTarget = this.renderTarget;
      const pixelBuffer = this.pixelBuffer;
      const packed = renderTarget.texture.type !== FloatType;
      let x = 0, y = 0;
      if (mode === DepthCopyMode.SINGLE) {
        super.render(renderer);
      } else {
        const texelPosition = material.texelPosition;
        x = Math.round(texelPosition.x * renderTarget.width);
        y = Math.round(texelPosition.y * renderTarget.height);
      }
      renderer.readRenderTargetPixels(renderTarget, x, y, 1, 1, pixelBuffer);
      this.callback(packed ? unpackRGBAToDepth(pixelBuffer) : pixelBuffer[0]);
      this.callback = null;
    }
  }
  /**
   * Updates the size of this pass.
   *
   * @param {Number} width - The width.
   * @param {Number} height - The height.
   */
  setSize(width, height) {
    if (this.fullscreenMaterial.mode === DepthCopyMode.FULL) {
      super.setSize(width, height);
    }
  }
};
function prefixSubstrings(prefix, substrings, strings) {
  for (const substring of substrings) {
    const prefixed = "$1" + prefix + substring.charAt(0).toUpperCase() + substring.slice(1);
    const regExp = new RegExp("([^\\.])(\\b" + substring + "\\b)", "g");
    for (const entry of strings.entries()) {
      if (entry[1] !== null) {
        strings.set(entry[0], entry[1].replace(regExp, prefixed));
      }
    }
  }
}
function integrateEffect(prefix, effect, data) {
  let fragmentShader = effect.getFragmentShader();
  let vertexShader = effect.getVertexShader();
  const mainImageExists = fragmentShader !== void 0 && /mainImage/.test(fragmentShader);
  const mainUvExists = fragmentShader !== void 0 && /mainUv/.test(fragmentShader);
  data.attributes |= effect.getAttributes();
  if (fragmentShader === void 0) {
    throw new Error(`Missing fragment shader (${effect.name})`);
  } else if (mainUvExists && (data.attributes & EffectAttribute.CONVOLUTION) !== 0) {
    throw new Error(`Effects that transform UVs are incompatible with convolution effects (${effect.name})`);
  } else if (!mainImageExists && !mainUvExists) {
    throw new Error(`Could not find mainImage or mainUv function (${effect.name})`);
  } else {
    const functionRegExp = /\w+\s+(\w+)\([\w\s,]*\)\s*{/g;
    const shaderParts = data.shaderParts;
    let fragmentHead = shaderParts.get(EffectShaderSection.FRAGMENT_HEAD) || "";
    let fragmentMainUv = shaderParts.get(EffectShaderSection.FRAGMENT_MAIN_UV) || "";
    let fragmentMainImage = shaderParts.get(EffectShaderSection.FRAGMENT_MAIN_IMAGE) || "";
    let vertexHead = shaderParts.get(EffectShaderSection.VERTEX_HEAD) || "";
    let vertexMainSupport = shaderParts.get(EffectShaderSection.VERTEX_MAIN_SUPPORT) || "";
    const varyings = /* @__PURE__ */ new Set();
    const names = /* @__PURE__ */ new Set();
    if (mainUvExists) {
      fragmentMainUv += `	${prefix}MainUv(UV);
`;
      data.uvTransformation = true;
    }
    if (vertexShader !== null && /mainSupport/.test(vertexShader)) {
      const needsUv = /mainSupport *\([\w\s]*?uv\s*?\)/.test(vertexShader);
      vertexMainSupport += `	${prefix}MainSupport(`;
      vertexMainSupport += needsUv ? "vUv);\n" : ");\n";
      for (const m2 of vertexShader.matchAll(/(?:varying\s+\w+\s+([\S\s]*?);)/g)) {
        for (const n of m2[1].split(/\s*,\s*/)) {
          data.varyings.add(n);
          varyings.add(n);
          names.add(n);
        }
      }
      for (const m2 of vertexShader.matchAll(functionRegExp)) {
        names.add(m2[1]);
      }
    }
    for (const m2 of fragmentShader.matchAll(functionRegExp)) {
      names.add(m2[1]);
    }
    for (const d of effect.defines.keys()) {
      names.add(d.replace(/\([\w\s,]*\)/g, ""));
    }
    for (const u of effect.uniforms.keys()) {
      names.add(u);
    }
    names.delete("while");
    names.delete("for");
    names.delete("if");
    effect.uniforms.forEach((val, key) => data.uniforms.set(prefix + key.charAt(0).toUpperCase() + key.slice(1), val));
    effect.defines.forEach((val, key) => data.defines.set(prefix + key.charAt(0).toUpperCase() + key.slice(1), val));
    const shaders = /* @__PURE__ */ new Map([["fragment", fragmentShader], ["vertex", vertexShader]]);
    prefixSubstrings(prefix, names, data.defines);
    prefixSubstrings(prefix, names, shaders);
    fragmentShader = shaders.get("fragment");
    vertexShader = shaders.get("vertex");
    const blendMode = effect.blendMode;
    data.blendModes.set(blendMode.blendFunction, blendMode);
    if (mainImageExists) {
      if (effect.inputColorSpace !== null && effect.inputColorSpace !== data.colorSpace) {
        fragmentMainImage += effect.inputColorSpace === SRGBColorSpace ? "color0 = sRGBTransferOETF(color0);\n	" : "color0 = sRGBToLinear(color0);\n	";
      }
      if (effect.outputColorSpace !== NoColorSpace) {
        data.colorSpace = effect.outputColorSpace;
      } else if (effect.inputColorSpace !== null) {
        data.colorSpace = effect.inputColorSpace;
      }
      const depthParamRegExp = /MainImage *\([\w\s,]*?depth[\w\s,]*?\)/;
      fragmentMainImage += `${prefix}MainImage(color0, UV, `;
      if ((data.attributes & EffectAttribute.DEPTH) !== 0 && depthParamRegExp.test(fragmentShader)) {
        fragmentMainImage += "depth, ";
        data.readDepth = true;
      }
      fragmentMainImage += "color1);\n	";
      const blendOpacity = prefix + "BlendOpacity";
      data.uniforms.set(blendOpacity, blendMode.opacity);
      fragmentMainImage += `color0 = blend${blendMode.blendFunction}(color0, color1, ${blendOpacity});

	`;
      fragmentHead += `uniform float ${blendOpacity};

`;
    }
    fragmentHead += fragmentShader + "\n";
    if (vertexShader !== null) {
      vertexHead += vertexShader + "\n";
    }
    shaderParts.set(EffectShaderSection.FRAGMENT_HEAD, fragmentHead);
    shaderParts.set(EffectShaderSection.FRAGMENT_MAIN_UV, fragmentMainUv);
    shaderParts.set(EffectShaderSection.FRAGMENT_MAIN_IMAGE, fragmentMainImage);
    shaderParts.set(EffectShaderSection.VERTEX_HEAD, vertexHead);
    shaderParts.set(EffectShaderSection.VERTEX_MAIN_SUPPORT, vertexMainSupport);
    if (effect.extensions !== null) {
      for (const extension of effect.extensions) {
        data.extensions.add(extension);
      }
    }
  }
}
var EffectPass = class extends Pass {
  /**
   * Constructs a new effect pass.
   *
   * @param {Camera} camera - The main camera.
   * @param {...Effect} effects - The effects that will be rendered by this pass.
   */
  constructor(camera, ...effects) {
    super("EffectPass");
    this.fullscreenMaterial = new EffectMaterial(null, null, null, camera);
    this.listener = (event) => this.handleEvent(event);
    this.effects = [];
    this.setEffects(effects);
    this.skipRendering = false;
    this.minTime = 1;
    this.maxTime = Number.POSITIVE_INFINITY;
    this.timeScale = 1;
  }
  set mainScene(value) {
    for (const effect of this.effects) {
      effect.mainScene = value;
    }
  }
  set mainCamera(value) {
    this.fullscreenMaterial.copyCameraSettings(value);
    for (const effect of this.effects) {
      effect.mainCamera = value;
    }
  }
  /**
   * Indicates whether this pass encodes its output when rendering to screen.
   *
   * @type {Boolean}
   * @deprecated Use fullscreenMaterial.encodeOutput instead.
   */
  get encodeOutput() {
    return this.fullscreenMaterial.encodeOutput;
  }
  set encodeOutput(value) {
    this.fullscreenMaterial.encodeOutput = value;
  }
  /**
   * Indicates whether dithering is enabled.
   *
   * @type {Boolean}
   */
  get dithering() {
    return this.fullscreenMaterial.dithering;
  }
  set dithering(value) {
    const material = this.fullscreenMaterial;
    material.dithering = value;
    material.needsUpdate = true;
  }
  /**
   * Sets the effects.
   *
   * @param {Effect[]} effects - The effects.
   * @protected
   */
  setEffects(effects) {
    for (const effect of this.effects) {
      effect.removeEventListener("change", this.listener);
    }
    this.effects = effects.sort((a, b) => b.attributes - a.attributes);
    for (const effect of this.effects) {
      effect.addEventListener("change", this.listener);
    }
  }
  /**
   * Updates the compound shader material.
   *
   * @protected
   */
  updateMaterial() {
    const data = new EffectShaderData();
    let id = 0;
    for (const effect of this.effects) {
      if (effect.blendMode.blendFunction === BlendFunction.DST) {
        data.attributes |= effect.getAttributes() & EffectAttribute.DEPTH;
      } else if ((data.attributes & effect.getAttributes() & EffectAttribute.CONVOLUTION) !== 0) {
        throw new Error(`Convolution effects cannot be merged (${effect.name})`);
      } else {
        integrateEffect("e" + id++, effect, data);
      }
    }
    let fragmentHead = data.shaderParts.get(EffectShaderSection.FRAGMENT_HEAD);
    let fragmentMainImage = data.shaderParts.get(EffectShaderSection.FRAGMENT_MAIN_IMAGE);
    let fragmentMainUv = data.shaderParts.get(EffectShaderSection.FRAGMENT_MAIN_UV);
    const blendRegExp = /\bblend\b/g;
    for (const blendMode of data.blendModes.values()) {
      fragmentHead += blendMode.getShaderCode().replace(blendRegExp, `blend${blendMode.blendFunction}`) + "\n";
    }
    if ((data.attributes & EffectAttribute.DEPTH) !== 0) {
      if (data.readDepth) {
        fragmentMainImage = "float depth = readDepth(UV);\n\n	" + fragmentMainImage;
      }
      this.needsDepthTexture = this.getDepthTexture() === null;
    } else {
      this.needsDepthTexture = false;
    }
    if (data.colorSpace === SRGBColorSpace) {
      fragmentMainImage += "color0 = sRGBToLinear(color0);\n	";
    }
    if (data.uvTransformation) {
      fragmentMainUv = "vec2 transformedUv = vUv;\n" + fragmentMainUv;
      data.defines.set("UV", "transformedUv");
    } else {
      data.defines.set("UV", "vUv");
    }
    data.shaderParts.set(EffectShaderSection.FRAGMENT_HEAD, fragmentHead);
    data.shaderParts.set(EffectShaderSection.FRAGMENT_MAIN_IMAGE, fragmentMainImage);
    data.shaderParts.set(EffectShaderSection.FRAGMENT_MAIN_UV, fragmentMainUv);
    for (const [key, value] of data.shaderParts) {
      if (value !== null) {
        data.shaderParts.set(key, value.trim().replace(/^#/, "\n#"));
      }
    }
    this.skipRendering = id === 0;
    this.needsSwap = !this.skipRendering;
    this.fullscreenMaterial.setShaderData(data);
  }
  /**
   * Rebuilds the shader material.
   */
  recompile() {
    this.updateMaterial();
  }
  /**
   * Returns the current depth texture.
   *
   * @return {Texture} The current depth texture, or null if there is none.
   */
  getDepthTexture() {
    return this.fullscreenMaterial.depthBuffer;
  }
  /**
   * Sets the depth texture.
   *
   * @param {Texture} depthTexture - A depth texture.
   * @param {DepthPackingStrategies} [depthPacking=BasicDepthPacking] - The depth packing.
   */
  setDepthTexture(depthTexture, depthPacking = BasicDepthPacking) {
    this.fullscreenMaterial.depthBuffer = depthTexture;
    this.fullscreenMaterial.depthPacking = depthPacking;
    for (const effect of this.effects) {
      effect.setDepthTexture(depthTexture, depthPacking);
    }
  }
  /**
   * Renders the effect.
   *
   * @param {WebGLRenderer} renderer - The renderer.
   * @param {WebGLRenderTarget} inputBuffer - A frame buffer that contains the result of the previous pass.
   * @param {WebGLRenderTarget} outputBuffer - A frame buffer that serves as the output render target unless this pass renders to screen.
   * @param {Number} [deltaTime] - The time between the last frame and the current one in seconds.
   * @param {Boolean} [stencilTest] - Indicates whether a stencil mask is active.
   */
  render(renderer, inputBuffer, outputBuffer, deltaTime, stencilTest) {
    for (const effect of this.effects) {
      effect.update(renderer, inputBuffer, deltaTime);
    }
    if (!this.skipRendering || this.renderToScreen) {
      const material = this.fullscreenMaterial;
      material.inputBuffer = inputBuffer.texture;
      material.time += deltaTime * this.timeScale;
      renderer.setRenderTarget(this.renderToScreen ? null : outputBuffer);
      renderer.render(this.scene, this.camera);
    }
  }
  /**
   * Updates the size of this pass.
   *
   * @param {Number} width - The width.
   * @param {Number} height - The height.
   */
  setSize(width, height) {
    this.fullscreenMaterial.setSize(width, height);
    for (const effect of this.effects) {
      effect.setSize(width, height);
    }
  }
  /**
   * Performs initialization tasks.
   *
   * @param {WebGLRenderer} renderer - The renderer.
   * @param {Boolean} alpha - Whether the renderer uses the alpha channel or not.
   * @param {Number} frameBufferType - The type of the main frame buffers.
   */
  initialize(renderer, alpha, frameBufferType) {
    this.renderer = renderer;
    for (const effect of this.effects) {
      effect.initialize(renderer, alpha, frameBufferType);
    }
    this.updateMaterial();
    if (frameBufferType !== void 0 && frameBufferType !== UnsignedByteType) {
      this.fullscreenMaterial.defines.FRAMEBUFFER_PRECISION_HIGH = "1";
    }
  }
  /**
   * Deletes disposable objects.
   */
  dispose() {
    super.dispose();
    for (const effect of this.effects) {
      effect.removeEventListener("change", this.listener);
      effect.dispose();
    }
  }
  /**
   * Handles events.
   *
   * @param {Event} event - An event.
   */
  handleEvent(event) {
    switch (event.type) {
      case "change":
        this.recompile();
        break;
    }
  }
};
var NormalPass = class extends Pass {
  /**
   * Constructs a new normal pass.
   *
   * @param {Scene} scene - The scene to render.
   * @param {Camera} camera - The camera to use to render the scene.
   * @param {Object} [options] - The options.
   * @param {WebGLRenderTarget} [options.renderTarget] - A custom render target.
   * @param {Number} [options.resolutionScale=1.0] - The resolution scale.
   * @param {Number} [options.resolutionX=Resolution.AUTO_SIZE] - The horizontal resolution.
   * @param {Number} [options.resolutionY=Resolution.AUTO_SIZE] - The vertical resolution.
   * @param {Number} [options.width=Resolution.AUTO_SIZE] - Deprecated. Use resolutionX instead.
   * @param {Number} [options.height=Resolution.AUTO_SIZE] - Deprecated. Use resolutionY instead.
   */
  constructor(scene, camera, {
    renderTarget,
    resolutionScale = 1,
    width = Resolution.AUTO_SIZE,
    height = Resolution.AUTO_SIZE,
    resolutionX = width,
    resolutionY = height
  } = {}) {
    super("NormalPass");
    this.needsSwap = false;
    this.renderPass = new RenderPass(scene, camera, new MeshNormalMaterial());
    const renderPass = this.renderPass;
    renderPass.ignoreBackground = true;
    renderPass.skipShadowMapUpdate = true;
    const clearPass = renderPass.getClearPass();
    clearPass.overrideClearColor = new Color(7829503);
    clearPass.overrideClearAlpha = 1;
    this.renderTarget = renderTarget;
    if (this.renderTarget === void 0) {
      this.renderTarget = new WebGLRenderTarget(1, 1, {
        minFilter: NearestFilter,
        magFilter: NearestFilter
      });
      this.renderTarget.texture.name = "NormalPass.Target";
    }
    const resolution = this.resolution = new Resolution(this, resolutionX, resolutionY, resolutionScale);
    resolution.addEventListener("change", (e) => this.setSize(resolution.baseWidth, resolution.baseHeight));
  }
  set mainScene(value) {
    this.renderPass.mainScene = value;
  }
  set mainCamera(value) {
    this.renderPass.mainCamera = value;
  }
  /**
   * The normal texture.
   *
   * @type {Texture}
   */
  get texture() {
    return this.renderTarget.texture;
  }
  /**
   * The normal texture.
   *
   * @deprecated Use texture instead.
   * @return {Texture} The texture.
   */
  getTexture() {
    return this.renderTarget.texture;
  }
  /**
   * Returns the resolution settings.
   *
   * @deprecated Use resolution instead.
   * @return {Resolution} The resolution.
   */
  getResolution() {
    return this.resolution;
  }
  /**
   * Returns the current resolution scale.
   *
   * @return {Number} The resolution scale.
   * @deprecated Use resolution.preferredWidth or resolution.preferredHeight instead.
   */
  getResolutionScale() {
    return this.resolution.scale;
  }
  /**
   * Sets the resolution scale.
   *
   * @param {Number} scale - The new resolution scale.
   * @deprecated Use resolution.preferredWidth or resolution.preferredHeight instead.
   */
  setResolutionScale(scale3) {
    this.resolution.scale = scale3;
  }
  /**
   * Renders the scene normals.
   *
   * @param {WebGLRenderer} renderer - The renderer.
   * @param {WebGLRenderTarget} inputBuffer - A frame buffer that contains the result of the previous pass.
   * @param {WebGLRenderTarget} outputBuffer - A frame buffer that serves as the output render target unless this pass renders to screen.
   * @param {Number} [deltaTime] - The time between the last frame and the current one in seconds.
   * @param {Boolean} [stencilTest] - Indicates whether a stencil mask is active.
   */
  render(renderer, inputBuffer, outputBuffer, deltaTime, stencilTest) {
    const renderTarget = this.renderToScreen ? null : this.renderTarget;
    this.renderPass.render(renderer, renderTarget, renderTarget);
  }
  /**
   * Updates the size of this pass.
   *
   * @param {Number} width - The width.
   * @param {Number} height - The height.
   */
  setSize(width, height) {
    const resolution = this.resolution;
    resolution.setBaseSize(width, height);
    this.renderTarget.setSize(resolution.width, resolution.height);
  }
};
var P = [
  new Float32Array(3),
  new Float32Array(3)
];
var C = [
  new Float32Array(3),
  new Float32Array(3),
  new Float32Array(3),
  new Float32Array(3)
];
var T = [
  [
    new Float32Array([0, 0, 0]),
    new Float32Array([1, 0, 0]),
    new Float32Array([1, 1, 0]),
    new Float32Array([1, 1, 1])
  ],
  [
    new Float32Array([0, 0, 0]),
    new Float32Array([1, 0, 0]),
    new Float32Array([1, 0, 1]),
    new Float32Array([1, 1, 1])
  ],
  [
    new Float32Array([0, 0, 0]),
    new Float32Array([0, 0, 1]),
    new Float32Array([1, 0, 1]),
    new Float32Array([1, 1, 1])
  ],
  [
    new Float32Array([0, 0, 0]),
    new Float32Array([0, 1, 0]),
    new Float32Array([1, 1, 0]),
    new Float32Array([1, 1, 1])
  ],
  [
    new Float32Array([0, 0, 0]),
    new Float32Array([0, 1, 0]),
    new Float32Array([0, 1, 1]),
    new Float32Array([1, 1, 1])
  ],
  [
    new Float32Array([0, 0, 0]),
    new Float32Array([0, 0, 1]),
    new Float32Array([0, 1, 1]),
    new Float32Array([1, 1, 1])
  ]
];
var area = [
  new Float32Array(2),
  new Float32Array(2)
];
var orthogonalSubsamplingOffsets = new Float32Array([
  0,
  -0.25,
  0.25,
  -0.125,
  0.125,
  -0.375,
  0.375
]);
var diagonalSubsamplingOffsets = [
  new Float32Array([0, 0]),
  new Float32Array([0.25, -0.25]),
  new Float32Array([-0.25, 0.25]),
  new Float32Array([0.125, -0.125]),
  new Float32Array([-0.125, 0.125])
];
var orthogonalEdges = [
  new Uint8Array([0, 0]),
  new Uint8Array([3, 0]),
  new Uint8Array([0, 3]),
  new Uint8Array([3, 3]),
  new Uint8Array([1, 0]),
  new Uint8Array([4, 0]),
  new Uint8Array([1, 3]),
  new Uint8Array([4, 3]),
  new Uint8Array([0, 1]),
  new Uint8Array([3, 1]),
  new Uint8Array([0, 4]),
  new Uint8Array([3, 4]),
  new Uint8Array([1, 1]),
  new Uint8Array([4, 1]),
  new Uint8Array([1, 4]),
  new Uint8Array([4, 4])
];
var diagonalEdges = [
  new Uint8Array([0, 0]),
  new Uint8Array([1, 0]),
  new Uint8Array([0, 2]),
  new Uint8Array([1, 2]),
  new Uint8Array([2, 0]),
  new Uint8Array([3, 0]),
  new Uint8Array([2, 2]),
  new Uint8Array([3, 2]),
  new Uint8Array([0, 1]),
  new Uint8Array([1, 1]),
  new Uint8Array([0, 3]),
  new Uint8Array([1, 3]),
  new Uint8Array([2, 1]),
  new Uint8Array([3, 1]),
  new Uint8Array([2, 3]),
  new Uint8Array([3, 3])
];
var edges = /* @__PURE__ */ new Map([
  [bilinear(0, 0, 0, 0), new Float32Array([0, 0, 0, 0])],
  [bilinear(0, 0, 0, 1), new Float32Array([0, 0, 0, 1])],
  [bilinear(0, 0, 1, 0), new Float32Array([0, 0, 1, 0])],
  [bilinear(0, 0, 1, 1), new Float32Array([0, 0, 1, 1])],
  [bilinear(0, 1, 0, 0), new Float32Array([0, 1, 0, 0])],
  [bilinear(0, 1, 0, 1), new Float32Array([0, 1, 0, 1])],
  [bilinear(0, 1, 1, 0), new Float32Array([0, 1, 1, 0])],
  [bilinear(0, 1, 1, 1), new Float32Array([0, 1, 1, 1])],
  [bilinear(1, 0, 0, 0), new Float32Array([1, 0, 0, 0])],
  [bilinear(1, 0, 0, 1), new Float32Array([1, 0, 0, 1])],
  [bilinear(1, 0, 1, 0), new Float32Array([1, 0, 1, 0])],
  [bilinear(1, 0, 1, 1), new Float32Array([1, 0, 1, 1])],
  [bilinear(1, 1, 0, 0), new Float32Array([1, 1, 0, 0])],
  [bilinear(1, 1, 0, 1), new Float32Array([1, 1, 0, 1])],
  [bilinear(1, 1, 1, 0), new Float32Array([1, 1, 1, 0])],
  [bilinear(1, 1, 1, 1), new Float32Array([1, 1, 1, 1])]
]);
function lerp2(a, b, p2) {
  return a + (b - a) * p2;
}
function bilinear(e0, e1, e2, e3) {
  const a = lerp2(e0, e1, 1 - 0.25);
  const b = lerp2(e2, e3, 1 - 0.25);
  return lerp2(a, b, 1 - 0.125);
}

// node_modules/@react-three/postprocessing/node_modules/maath/dist/objectSpread2-284232a6.esm.js
function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }
  return obj;
}
function ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object);
  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);
    if (enumerableOnly) {
      symbols = symbols.filter(function(sym) {
        return Object.getOwnPropertyDescriptor(object, sym).enumerable;
      });
    }
    keys.push.apply(keys, symbols);
  }
  return keys;
}
function _objectSpread2(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};
    if (i % 2) {
      ownKeys(Object(source), true).forEach(function(key) {
        _defineProperty(target, key, source[key]);
      });
    } else if (Object.getOwnPropertyDescriptors) {
      Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
      ownKeys(Object(source)).forEach(function(key) {
        Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
      });
    }
  }
  return target;
}

// node_modules/@react-three/postprocessing/node_modules/maath/dist/isNativeReflectConstruct-5594d075.esm.js
function _setPrototypeOf(o, p2) {
  _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf2(o2, p3) {
    o2.__proto__ = p3;
    return o2;
  };
  return _setPrototypeOf(o, p2);
}
function _isNativeReflectConstruct() {
  if (typeof Reflect === "undefined" || !Reflect.construct) return false;
  if (Reflect.construct.sham) return false;
  if (typeof Proxy === "function") return true;
  try {
    Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {
    }));
    return true;
  } catch (e) {
    return false;
  }
}

// node_modules/@react-three/postprocessing/node_modules/maath/dist/matrix-baa530bf.esm.js
function determinant2() {
  for (var _len = arguments.length, terms = new Array(_len), _key = 0; _key < _len; _key++) {
    terms[_key] = arguments[_key];
  }
  var a = terms[0], b = terms[1], c2 = terms[2], d = terms[3];
  return a * d - b * c2;
}
function determinant3() {
  for (var _len2 = arguments.length, terms = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
    terms[_key2] = arguments[_key2];
  }
  var a = terms[0], b = terms[1], c2 = terms[2], d = terms[3], e = terms[4], f = terms[5], g = terms[6], h = terms[7], i = terms[8];
  return a * e * i + b * f * g + c2 * d * h - c2 * e * g - b * d * i - a * f * h;
}
function determinant4() {
  for (var _len3 = arguments.length, terms = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
    terms[_key3] = arguments[_key3];
  }
  terms[0];
  terms[1];
  terms[2];
  terms[3];
  terms[4];
  terms[5];
  terms[6];
  terms[7];
  terms[8];
  terms[9];
  terms[10];
  terms[11];
  terms[12];
  terms[13];
  terms[14];
}
function getMinor(matrix2, r, c2) {
  var _matrixTranspose = matrix2.clone().transpose();
  var x = [];
  var l = _matrixTranspose.elements.length;
  var n = Math.sqrt(l);
  for (var i = 0; i < l; i++) {
    var element = _matrixTranspose.elements[i];
    var row = Math.floor(i / n);
    var col2 = i % n;
    if (row !== r - 1 && col2 !== c2 - 1) {
      x.push(element);
    }
  }
  return determinant3.apply(void 0, x);
}
function matrixSum3(m1, m2) {
  var sum = [];
  var m1Array = m1.toArray();
  var m2Array = m2.toArray();
  for (var i = 0; i < m1Array.length; i++) {
    sum[i] = m1Array[i] + m2Array[i];
  }
  return new Matrix3().fromArray(sum);
}
var matrix = Object.freeze({
  __proto__: null,
  determinant2,
  determinant3,
  determinant4,
  getMinor,
  matrixSum3
});

// node_modules/@react-three/postprocessing/node_modules/maath/dist/triangle-b62b9067.esm.js
function _arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr;
}
function _iterableToArrayLimit(arr, i) {
  var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"];
  if (_i == null) return;
  var _arr = [];
  var _n = true;
  var _d = false;
  var _s, _e;
  try {
    for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) {
      _arr.push(_s.value);
      if (i && _arr.length === i) break;
    }
  } catch (err) {
    _d = true;
    _e = err;
  } finally {
    try {
      if (!_n && _i["return"] != null) _i["return"]();
    } finally {
      if (_d) throw _e;
    }
  }
  return _arr;
}
function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;
  for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];
  return arr2;
}
function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return _arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}
function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function _slicedToArray(arr, i) {
  return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
}
function _arrayWithoutHoles(arr) {
  if (Array.isArray(arr)) return _arrayLikeToArray(arr);
}
function _iterableToArray(iter) {
  if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter);
}
function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function _toConsumableArray(arr) {
  return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread();
}
function _construct(Parent, args, Class) {
  if (_isNativeReflectConstruct()) {
    _construct = Reflect.construct;
  } else {
    _construct = function _construct2(Parent2, args2, Class2) {
      var a = [null];
      a.push.apply(a, args2);
      var Constructor = Function.bind.apply(Parent2, a);
      var instance = new Constructor();
      if (Class2) _setPrototypeOf(instance, Class2.prototype);
      return instance;
    };
  }
  return _construct.apply(null, arguments);
}
function isPointInTriangle(point, triangle2) {
  var _triangle$ = _slicedToArray(triangle2[0], 2), ax = _triangle$[0], ay = _triangle$[1];
  var _triangle$2 = _slicedToArray(triangle2[1], 2), bx = _triangle$2[0], by = _triangle$2[1];
  var _triangle$3 = _slicedToArray(triangle2[2], 2), cx = _triangle$3[0], cy = _triangle$3[1];
  var _point = _slicedToArray(point, 2), px = _point[0], py = _point[1];
  var matrix2 = new Matrix4();
  matrix2.set(ax, ay, ax * ax + ay * ay, 1, bx, by, bx * bx + by * by, 1, cx, cy, cx * cx + cy * cy, 1, px, py, px * px + py * py, 1);
  return matrix2.determinant() <= 0;
}
function triangleDeterminant(triangle2) {
  var _triangle$4 = _slicedToArray(triangle2[0], 2), x1 = _triangle$4[0], y1 = _triangle$4[1];
  var _triangle$5 = _slicedToArray(triangle2[1], 2), x2 = _triangle$5[0], y2 = _triangle$5[1];
  var _triangle$6 = _slicedToArray(triangle2[2], 2), x3 = _triangle$6[0], y3 = _triangle$6[1];
  return determinant3(x1, y1, 1, x2, y2, 1, x3, y3, 1);
}
function arePointsCollinear(points) {
  return triangleDeterminant(points) === 0;
}
function isTriangleClockwise(triangle2) {
  return triangleDeterminant(triangle2) < 0;
}
function getCircumcircle(triangle2) {
  var _triangle$7 = _slicedToArray(triangle2[0], 2), ax = _triangle$7[0], ay = _triangle$7[1];
  var _triangle$8 = _slicedToArray(triangle2[1], 2), bx = _triangle$8[0], by = _triangle$8[1];
  var _triangle$9 = _slicedToArray(triangle2[2], 2), cx = _triangle$9[0], cy = _triangle$9[1];
  if (arePointsCollinear(triangle2)) return null;
  var m2 = new Matrix4();
  m2.set(1, 1, 1, 1, ax * ax + ay * ay, ax, ay, 1, bx * bx + by * by, bx, by, 1, cx * cx + cy * cy, cx, cy, 1);
  var m11 = getMinor(m2, 1, 1);
  var m13 = getMinor(m2, 1, 3);
  var m12 = getMinor(m2, 1, 2);
  var m14 = getMinor(m2, 1, 4);
  var x0 = 0.5 * (m12 / m11);
  var y0 = 0.5 * (m13 / m11);
  var r2 = x0 * x0 + y0 * y0 + m14 / m11;
  return {
    x: Math.abs(x0) === 0 ? 0 : x0,
    y: Math.abs(y0) === 0 ? 0 : -y0,
    r: Math.sqrt(r2)
  };
}
function isPointInCircumcircle(point, triangle2) {
  var _ref = Array.isArray(triangle2[0]) ? triangle2[0] : triangle2[0].toArray(), _ref2 = _slicedToArray(_ref, 2), ax = _ref2[0], ay = _ref2[1];
  var _ref3 = Array.isArray(triangle2[1]) ? triangle2[1] : triangle2[1].toArray(), _ref4 = _slicedToArray(_ref3, 2), bx = _ref4[0], by = _ref4[1];
  var _ref5 = Array.isArray(triangle2[2]) ? triangle2[2] : triangle2[2].toArray(), _ref6 = _slicedToArray(_ref5, 2), cx = _ref6[0], cy = _ref6[1];
  var _point2 = _slicedToArray(point, 2), px = _point2[0], py = _point2[1];
  if (arePointsCollinear(triangle2)) throw new Error("Collinear points don't form a triangle");
  var x1mpx = ax - px;
  var aympy = ay - py;
  var bxmpx = bx - px;
  var bympy = by - py;
  var cxmpx = cx - px;
  var cympy = cy - py;
  var d = determinant3(x1mpx, aympy, x1mpx * x1mpx + aympy * aympy, bxmpx, bympy, bxmpx * bxmpx + bympy * bympy, cxmpx, cympy, cxmpx * cxmpx + cympy * cympy);
  if (d === 0) {
    return true;
  }
  return !isTriangleClockwise(triangle2) ? d > 0 : d < 0;
}
var mv1 = new Vector2();
var mv2 = new Vector2();
function doThreePointsMakeARight(points) {
  var _points$map = points.map(function(p4) {
    if (Array.isArray(p4)) {
      return _construct(Vector2, _toConsumableArray(p4));
    }
    return p4;
  }), _points$map2 = _slicedToArray(_points$map, 3), p1 = _points$map2[0], p2 = _points$map2[1], p3 = _points$map2[2];
  if (arePointsCollinear(points)) return false;
  var p2p1 = mv1.subVectors(p2, p1);
  var p3p1 = mv2.subVectors(p3, p1);
  var cross2 = p3p1.cross(p2p1);
  return cross2 > 0;
}
var triangle = Object.freeze({
  __proto__: null,
  isPointInTriangle,
  triangleDeterminant,
  arePointsCollinear,
  isTriangleClockwise,
  getCircumcircle,
  isPointInCircumcircle,
  doThreePointsMakeARight
});

// node_modules/@react-three/postprocessing/node_modules/maath/dist/misc-7d870b3c.esm.js
function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}
function repeat(t, length3) {
  return clamp(t - Math.floor(t / length3) * length3, 0, length3);
}
function deltaAngle(current, target) {
  var delta = repeat(target - current, Math.PI * 2);
  if (delta > Math.PI) delta -= Math.PI * 2;
  return delta;
}
function degToRad(degrees) {
  return degrees / 180 * Math.PI;
}
function radToDeg(radians) {
  return radians * 180 / Math.PI;
}
function fibonacciOnSphere(buffer2, _ref) {
  var _ref$radius = _ref.radius, radius = _ref$radius === void 0 ? 1 : _ref$radius;
  var samples = buffer2.length / 3;
  var offset = 2 / samples;
  var increment = Math.PI * (3 - 2.2360679775);
  for (var i = 0; i < buffer2.length; i += 3) {
    var y = i * offset - 1 + offset / 2;
    var distance3 = Math.sqrt(1 - Math.pow(y, 2));
    var phi = i % samples * increment;
    var x = Math.cos(phi) * distance3;
    var z2 = Math.sin(phi) * distance3;
    buffer2[i] = x * radius;
    buffer2[i + 1] = y * radius;
    buffer2[i + 2] = z2 * radius;
  }
}
function vectorEquals(a, b) {
  var eps = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : Number.EPSILON;
  return Math.abs(a.x - b.x) < eps && Math.abs(a.y - b.y) < eps && Math.abs(a.z - b.z) < eps;
}
function lexicographic(a, b) {
  if (a.x === b.x) {
    if (typeof a.z !== "undefined") {
      if (a.y === b.y) {
        return a.z - b.z;
      }
    }
    return a.y - b.y;
  }
  return a.x - b.x;
}
function convexHull(_points) {
  var points = _points.sort(lexicographic);
  var lUpper = [points[0], points[1]];
  for (var i = 2; i < points.length; i++) {
    lUpper.push(points[i]);
    while (lUpper.length > 2 && doThreePointsMakeARight(_toConsumableArray(lUpper.slice(-3)))) {
      lUpper.splice(lUpper.length - 2, 1);
    }
  }
  var lLower = [points[points.length - 1], points[points.length - 2]];
  for (var _i = points.length - 3; _i >= 0; _i--) {
    lLower.push(points[_i]);
    while (lLower.length > 2 && doThreePointsMakeARight(_toConsumableArray(lLower.slice(-3)))) {
      lLower.splice(lLower.length - 2, 1);
    }
  }
  lLower.splice(0, 1);
  lLower.splice(lLower.length - 1, 1);
  var c2 = [].concat(lUpper, lLower);
  return c2;
}
function remap(x, _ref2, _ref3) {
  var _ref4 = _slicedToArray(_ref2, 2), low1 = _ref4[0], high1 = _ref4[1];
  var _ref5 = _slicedToArray(_ref3, 2), low2 = _ref5[0], high2 = _ref5[1];
  return low2 + (x - low1) * (high2 - low2) / (high1 - low1);
}
function fade(t) {
  return t * t * t * (t * (t * 6 - 15) + 10);
}
function lerp(v0, v1, t) {
  return v0 * (1 - t) + v1 * t;
}
function inverseLerp(v0, v1, t) {
  return (t - v0) / (v1 - v0);
}
function normalize(x, y, z2) {
  var m2 = Math.sqrt(x * x + y * y + z2 * z2);
  return [x / m2, y / m2, z2 / m2];
}
function pointOnCubeToPointOnSphere(x, y, z2) {
  var x2 = x * x;
  var y2 = y * y;
  var z22 = z2 * z2;
  var nx = x * Math.sqrt(1 - (y2 + z22) / 2 + y2 * z22 / 3);
  var ny = y * Math.sqrt(1 - (z22 + x2) / 2 + z22 * x2 / 3);
  var nz = z2 * Math.sqrt(1 - (x2 + y2) / 2 + x2 * y2 / 3);
  return [nx, ny, nz];
}
function rotateVectorOnVector(a, b) {
  var v3 = new Vector3().crossVectors(a, b);
  var c2 = a.dot(b);
  var i = new Matrix3().identity();
  var vx = new Matrix3().set(0, -v3.z, v3.y, v3.z, 0, -v3.x, -v3.y, v3.x, 0);
  var vxsquared = new Matrix3().multiplyMatrices(vx, vx).multiplyScalar(1 / (1 + c2));
  var _final = matrixSum3(matrixSum3(i, vx), vxsquared);
  return _final;
}
function pointToCoordinate(x, y, z2) {
  var lat = Math.asin(y);
  var lon = Math.atan2(x, -z2);
  return [lat, lon];
}
function coordinateToPoint(lat, lon) {
  var y = Math.sin(lat);
  var r = Math.cos(lat);
  var x = Math.sin(lon) * r;
  var z2 = -Math.cos(lon) * r;
  return [x, y, z2];
}
function planeSegmentIntersection(plane, segment) {
  var _segment = _slicedToArray(segment, 2), a = _segment[0], b = _segment[1];
  var matrix2 = rotateVectorOnVector(plane.normal, new Vector3(0, 1, 0));
  var t = inverseLerp(a.clone().applyMatrix3(matrix2).y, b.clone().applyMatrix3(matrix2).y, 0);
  return new Vector3().lerpVectors(a, b, t);
}
function pointToPlaneDistance(p2, plane) {
  var d = plane.normal.dot(p2);
  return d;
}
function getIndexFrom3D(coords, sides) {
  var _coords = _slicedToArray(coords, 3), ix = _coords[0], iy = _coords[1], iz = _coords[2];
  var _sides = _slicedToArray(sides, 2), rx = _sides[0], ry = _sides[1];
  return iz * rx * ry + iy * rx + ix;
}
function get3DFromIndex(index2, size) {
  var _size = _slicedToArray(size, 2), rx = _size[0], ry = _size[1];
  var a = rx * ry;
  var z2 = index2 / a;
  var b = index2 - a * z2;
  var y = b / rx;
  var x = b % rx;
  return [x, y, z2];
}
function getIndexFrom2D(coords, size) {
  return coords[0] + size[0] * coords[1];
}
function get2DFromIndex(index2, columns) {
  var x = index2 % columns;
  var y = Math.floor(index2 / columns);
  return [x, y];
}
var misc = Object.freeze({
  __proto__: null,
  clamp,
  deltaAngle,
  degToRad,
  radToDeg,
  fibonacciOnSphere,
  vectorEquals,
  lexicographic,
  convexHull,
  remap,
  fade,
  lerp,
  inverseLerp,
  normalize,
  pointOnCubeToPointOnSphere,
  rotateVectorOnVector,
  pointToCoordinate,
  coordinateToPoint,
  planeSegmentIntersection,
  pointToPlaneDistance,
  getIndexFrom3D,
  get3DFromIndex,
  getIndexFrom2D,
  get2DFromIndex
});

// node_modules/@react-three/postprocessing/node_modules/maath/dist/vector2-d2bf51f1.esm.js
function zero() {
  return [0, 0];
}
function one() {
  return [1, 1];
}
function add(a, b) {
  return [a[0] + b[0], a[1] + b[1]];
}
function addValue(a, n) {
  return [a[0] + n, a[1] + n];
}
function sub(a, b) {
  return [a[0] - b[0], a[1] - b[1]];
}
function subValue(a, n) {
  return [a[0] - n, a[1] - n];
}
function scale(a, n) {
  return [a[0] * n, a[1] * n];
}
function dot(a, b) {
  return a[0] * b[0] + a[1] * b[1];
}
function lengthSqr(a) {
  return a[0] * a[0] + a[1] * a[1];
}
function length(a) {
  return Math.sqrt(a[0] * a[0] + a[1] * a[1]);
}
function distance(a, b) {
  return Math.sqrt((a[0] - b[0]) * (a[0] - b[0]) + (a[1] - b[1]) * (a[1] - b[1]));
}
var vector2 = Object.freeze({
  __proto__: null,
  zero,
  one,
  add,
  addValue,
  sub,
  subValue,
  scale,
  dot,
  lengthSqr,
  length,
  distance
});

// node_modules/@react-three/postprocessing/node_modules/maath/dist/vector3-0a088b7f.esm.js
function zero2() {
  return [0, 0, 0];
}
function one2() {
  return [1, 1, 1];
}
function add2(a, b) {
  return [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
}
function addValue2(a, n) {
  return [a[0] + n, a[1] + n, a[2] + n];
}
function sub2(a, b) {
  return [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
}
function subValue2(a, n) {
  return [a[0] - n, a[1] - n, a[2] - n];
}
function scale2(a, n) {
  return [a[0] * n, a[1] * n, a[2] * n];
}
function dot2(a, b) {
  return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
}
function cross(a, b) {
  var x = a[1] * b[2] - a[2] * b[1];
  var y = a[2] * b[0] - a[0] * b[2];
  var z2 = a[0] * b[1] - a[1] * b[0];
  return [x, y, z2];
}
function lengthSqr2(a) {
  return a[0] * a[0] + a[1] * a[1] + a[2] * a[2];
}
function length2(a) {
  return Math.sqrt(a[0] * a[0] + a[1] * a[1] + a[2] * a[2]);
}
function distance2(a, b) {
  return Math.sqrt((a[0] - b[0]) * (a[0] - b[0]) + (a[1] - b[1]) * (a[1] - b[1]) + (a[2] - b[2]) * (a[2] - b[2]));
}
var vector3 = Object.freeze({
  __proto__: null,
  zero: zero2,
  one: one2,
  add: add2,
  addValue: addValue2,
  sub: sub2,
  subValue: subValue2,
  scale: scale2,
  dot: dot2,
  cross,
  lengthSqr: lengthSqr2,
  length: length2,
  distance: distance2
});

// node_modules/@react-three/postprocessing/node_modules/maath/dist/buffer-d2a4726c.esm.js
function swizzle(buffer2) {
  var stride = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 3;
  var swizzle2 = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : "xyz";
  var o = {
    x: 0,
    y: 0,
    z: 0
  };
  for (var _i = 0; _i < buffer2.length; _i += stride) {
    o.x = buffer2[_i];
    o.y = buffer2[_i + 1];
    o.z = buffer2[_i + 2];
    var _swizzle$split = swizzle2.split(""), _swizzle$split2 = _slicedToArray(_swizzle$split, 3), x = _swizzle$split2[0], y = _swizzle$split2[1], z2 = _swizzle$split2[2];
    buffer2[_i] = o[x];
    buffer2[_i + 1] = o[y];
    if (stride === 3) {
      buffer2[_i + 2] = o[z2];
    }
  }
  return buffer2;
}
function addAxis(buffer2, size) {
  var valueGenerator = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : function() {
    return Math.random();
  };
  var newSize = size + 1;
  var newBuffer = new Float32Array(buffer2.length / size * newSize);
  for (var _i2 = 0; _i2 < buffer2.length; _i2 += size) {
    var _j = _i2 / size * newSize;
    newBuffer[_j] = buffer2[_i2];
    newBuffer[_j + 1] = buffer2[_i2 + 1];
    if (size === 2) {
      newBuffer[_j + 2] = valueGenerator(_j);
    }
    if (size === 3) {
      newBuffer[_j + 2] = buffer2[_i2 + 2];
      newBuffer[_j + 3] = valueGenerator(_j);
    }
  }
  return newBuffer;
}
function lerp3(bufferA, bufferB, _final, t) {
  for (var _i3 = 0; _i3 < bufferA.length; _i3++) {
    _final[_i3] = lerp(bufferA[_i3], bufferB[_i3], t);
  }
}
function translate(buffer2, translationVector) {
  var stride = translationVector.length;
  for (var _i4 = 0; _i4 < buffer2.length; _i4 += stride) {
    buffer2[_i4] += translationVector[0];
    buffer2[_i4 + 1] += translationVector[1];
    buffer2[_i4 + 2] += translationVector[2];
  }
  return buffer2;
}
function rotate(buffer2, rotation) {
  var defaultRotation = {
    center: [0, 0, 0],
    q: new Quaternion().identity()
  };
  var v3 = new Vector3();
  var _defaultRotation$rota = _objectSpread2(_objectSpread2({}, defaultRotation), rotation), q = _defaultRotation$rota.q, center2 = _defaultRotation$rota.center;
  for (var _i5 = 0; _i5 < buffer2.length; _i5 += 3) {
    v3.set(buffer2[_i5] - center2[0], buffer2[_i5 + 1] - center2[1], buffer2[_i5 + 2] - center2[2]);
    v3.applyQuaternion(q);
    buffer2[_i5] = v3.x + center2[0];
    buffer2[_i5 + 1] = v3.y + center2[1];
    buffer2[_i5 + 2] = v3.z + center2[1];
  }
  return buffer2;
}
function map(buffer2, stride, callback) {
  for (var _i6 = 0, _j2 = 0; _i6 < buffer2.length; _i6 += stride, _j2++) {
    if (stride === 3) {
      var res = callback([buffer2[_i6], buffer2[_i6 + 1], buffer2[_i6 + 2]], _j2);
      buffer2.set(res, _i6);
    } else {
      buffer2.set(callback([buffer2[_i6], buffer2[_i6 + 1]], _j2), _i6);
    }
  }
  return buffer2;
}
function reduce(b, stride, callback, acc) {
  for (var _i7 = 0, _j3 = 0; _i7 < b.length; _i7 += stride, _j3++) {
    if (stride === 2) {
      acc = callback(acc, [b[_i7], b[_i7 + 1]], _j3);
    } else {
      acc = callback(acc, [b[_i7], b[_i7 + 1], b[_i7 + 2]], _j3);
    }
  }
  return acc;
}
function expand(b, stride, opts) {
  var defaultExpandOptions = {
    center: [0, 0, 0]
  };
  var _defaultExpandOptions = _objectSpread2(_objectSpread2({}, defaultExpandOptions), opts), center2 = _defaultExpandOptions.center, distance3 = _defaultExpandOptions.distance;
  for (var _i8 = 0; _i8 < b.length; _i8 += stride) {
    b[_i8] = (b[_i8] - center2[0]) * (1 + distance3) + center2[0];
    b[_i8 + 1] = (b[_i8 + 1] - center2[1]) * (1 + distance3) + center2[1];
    if (stride === 3) {
      b[_i8 + 2] = (b[_i8 + 2] - center2[1]) * (1 + distance3) + center2[2];
    }
  }
  return b;
}
function center(myBuffer, stride) {
  return reduce(myBuffer, stride, function(acc, point) {
    if (stride === 3) {
      acc = add2(acc, point);
    } else {
      acc = add(acc, point);
    }
    return acc;
  }, zero());
}
function sort(myBuffer, stride, callback) {
  var indices = Int16Array.from({
    length: myBuffer.length / stride
  }, function(_, i) {
    return i;
  });
  indices.sort(function(a, b) {
    var pa = myBuffer.slice(a * stride, a * stride + stride);
    var pb = myBuffer.slice(b * stride, b * stride + stride);
    return callback(pa, pb);
  });
  var prevBuffer = myBuffer.slice(0);
  for (var _i9 = 0; _i9 < indices.length; _i9++) {
    var _j4 = indices[_i9];
    myBuffer.set(prevBuffer.slice(_j4 * stride, _j4 * stride + stride), _i9 * 3);
  }
  return myBuffer;
}
var buffer = Object.freeze({
  __proto__: null,
  swizzle,
  addAxis,
  lerp: lerp3,
  translate,
  rotate,
  map,
  reduce,
  expand,
  center,
  sort
});

// node_modules/@react-three/postprocessing/node_modules/maath/dist/classCallCheck-9098b006.esm.js
function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

// node_modules/@react-three/postprocessing/node_modules/maath/dist/index-43782085.esm.js
var Grad = function Grad2(x, y, z2) {
  var _this = this;
  _classCallCheck(this, Grad2);
  _defineProperty(this, "dot2", function(x2, y2) {
    return _this.x * x2 + _this.y * y2;
  });
  _defineProperty(this, "dot3", function(x2, y2, z3) {
    return _this.x * x2 + _this.y * y2 + _this.z * z3;
  });
  this.x = x;
  this.y = y;
  this.z = z2;
};
var grad3 = [new Grad(1, 1, 0), new Grad(-1, 1, 0), new Grad(1, -1, 0), new Grad(-1, -1, 0), new Grad(1, 0, 1), new Grad(-1, 0, 1), new Grad(1, 0, -1), new Grad(-1, 0, -1), new Grad(0, 1, 1), new Grad(0, -1, 1), new Grad(0, 1, -1), new Grad(0, -1, -1)];
var p = [151, 160, 137, 91, 90, 15, 131, 13, 201, 95, 96, 53, 194, 233, 7, 225, 140, 36, 103, 30, 69, 142, 8, 99, 37, 240, 21, 10, 23, 190, 6, 148, 247, 120, 234, 75, 0, 26, 197, 62, 94, 252, 219, 203, 117, 35, 11, 32, 57, 177, 33, 88, 237, 149, 56, 87, 174, 20, 125, 136, 171, 168, 68, 175, 74, 165, 71, 134, 139, 48, 27, 166, 77, 146, 158, 231, 83, 111, 229, 122, 60, 211, 133, 230, 220, 105, 92, 41, 55, 46, 245, 40, 244, 102, 143, 54, 65, 25, 63, 161, 1, 216, 80, 73, 209, 76, 132, 187, 208, 89, 18, 169, 200, 196, 135, 130, 116, 188, 159, 86, 164, 100, 109, 198, 173, 186, 3, 64, 52, 217, 226, 250, 124, 123, 5, 202, 38, 147, 118, 126, 255, 82, 85, 212, 207, 206, 59, 227, 47, 16, 58, 17, 182, 189, 28, 42, 223, 183, 170, 213, 119, 248, 152, 2, 44, 154, 163, 70, 221, 153, 101, 155, 167, 43, 172, 9, 129, 22, 39, 253, 19, 98, 108, 110, 79, 113, 224, 232, 178, 185, 112, 104, 218, 246, 97, 228, 251, 34, 242, 193, 238, 210, 144, 12, 191, 179, 162, 241, 81, 51, 145, 235, 249, 14, 239, 107, 49, 192, 214, 31, 181, 199, 106, 157, 184, 84, 204, 176, 115, 121, 50, 45, 127, 4, 150, 254, 138, 236, 205, 93, 222, 114, 67, 29, 24, 72, 243, 141, 128, 195, 78, 66, 215, 61, 156, 180];
var perm = new Array(512);
var gradP = new Array(512);
var seed = function seed2(_seed) {
  if (_seed > 0 && _seed < 1) {
    _seed *= 65536;
  }
  _seed = Math.floor(_seed);
  if (_seed < 256) {
    _seed |= _seed << 8;
  }
  for (var i = 0; i < 256; i++) {
    var v3;
    if (i & 1) {
      v3 = p[i] ^ _seed & 255;
    } else {
      v3 = p[i] ^ _seed >> 8 & 255;
    }
    perm[i] = perm[i + 256] = v3;
    gradP[i] = gradP[i + 256] = grad3[v3 % 12];
  }
};
seed(0);
var F2 = 0.5 * (Math.sqrt(3) - 1);
var G2 = (3 - Math.sqrt(3)) / 6;
var F3 = 1 / 3;
var G3 = 1 / 6;
var simplex2 = function simplex22(xin, yin) {
  var n0, n1, n2;
  var s = (xin + yin) * F2;
  var i = Math.floor(xin + s);
  var j2 = Math.floor(yin + s);
  var t = (i + j2) * G2;
  var x0 = xin - i + t;
  var y0 = yin - j2 + t;
  var i1, j1;
  if (x0 > y0) {
    i1 = 1;
    j1 = 0;
  } else {
    i1 = 0;
    j1 = 1;
  }
  var x1 = x0 - i1 + G2;
  var y1 = y0 - j1 + G2;
  var x2 = x0 - 1 + 2 * G2;
  var y2 = y0 - 1 + 2 * G2;
  i &= 255;
  j2 &= 255;
  var gi0 = gradP[i + perm[j2]];
  var gi1 = gradP[i + i1 + perm[j2 + j1]];
  var gi2 = gradP[i + 1 + perm[j2 + 1]];
  var t0 = 0.5 - x0 * x0 - y0 * y0;
  if (t0 < 0) {
    n0 = 0;
  } else {
    t0 *= t0;
    n0 = t0 * t0 * gi0.dot2(x0, y0);
  }
  var t1 = 0.5 - x1 * x1 - y1 * y1;
  if (t1 < 0) {
    n1 = 0;
  } else {
    t1 *= t1;
    n1 = t1 * t1 * gi1.dot2(x1, y1);
  }
  var t2 = 0.5 - x2 * x2 - y2 * y2;
  if (t2 < 0) {
    n2 = 0;
  } else {
    t2 *= t2;
    n2 = t2 * t2 * gi2.dot2(x2, y2);
  }
  return 70 * (n0 + n1 + n2);
};
var simplex3 = function simplex32(xin, yin, zin) {
  var n0, n1, n2, n3;
  var s = (xin + yin + zin) * F3;
  var i = Math.floor(xin + s);
  var j2 = Math.floor(yin + s);
  var k2 = Math.floor(zin + s);
  var t = (i + j2 + k2) * G3;
  var x0 = xin - i + t;
  var y0 = yin - j2 + t;
  var z0 = zin - k2 + t;
  var i1, j1, k1;
  var i2, j22, k22;
  if (x0 >= y0) {
    if (y0 >= z0) {
      i1 = 1;
      j1 = 0;
      k1 = 0;
      i2 = 1;
      j22 = 1;
      k22 = 0;
    } else if (x0 >= z0) {
      i1 = 1;
      j1 = 0;
      k1 = 0;
      i2 = 1;
      j22 = 0;
      k22 = 1;
    } else {
      i1 = 0;
      j1 = 0;
      k1 = 1;
      i2 = 1;
      j22 = 0;
      k22 = 1;
    }
  } else {
    if (y0 < z0) {
      i1 = 0;
      j1 = 0;
      k1 = 1;
      i2 = 0;
      j22 = 1;
      k22 = 1;
    } else if (x0 < z0) {
      i1 = 0;
      j1 = 1;
      k1 = 0;
      i2 = 0;
      j22 = 1;
      k22 = 1;
    } else {
      i1 = 0;
      j1 = 1;
      k1 = 0;
      i2 = 1;
      j22 = 1;
      k22 = 0;
    }
  }
  var x1 = x0 - i1 + G3;
  var y1 = y0 - j1 + G3;
  var z1 = z0 - k1 + G3;
  var x2 = x0 - i2 + 2 * G3;
  var y2 = y0 - j22 + 2 * G3;
  var z2 = z0 - k22 + 2 * G3;
  var x3 = x0 - 1 + 3 * G3;
  var y3 = y0 - 1 + 3 * G3;
  var z3 = z0 - 1 + 3 * G3;
  i &= 255;
  j2 &= 255;
  k2 &= 255;
  var gi0 = gradP[i + perm[j2 + perm[k2]]];
  var gi1 = gradP[i + i1 + perm[j2 + j1 + perm[k2 + k1]]];
  var gi2 = gradP[i + i2 + perm[j2 + j22 + perm[k2 + k22]]];
  var gi3 = gradP[i + 1 + perm[j2 + 1 + perm[k2 + 1]]];
  var t0 = 0.6 - x0 * x0 - y0 * y0 - z0 * z0;
  if (t0 < 0) {
    n0 = 0;
  } else {
    t0 *= t0;
    n0 = t0 * t0 * gi0.dot3(x0, y0, z0);
  }
  var t1 = 0.6 - x1 * x1 - y1 * y1 - z1 * z1;
  if (t1 < 0) {
    n1 = 0;
  } else {
    t1 *= t1;
    n1 = t1 * t1 * gi1.dot3(x1, y1, z1);
  }
  var t2 = 0.6 - x2 * x2 - y2 * y2 - z2 * z2;
  if (t2 < 0) {
    n2 = 0;
  } else {
    t2 *= t2;
    n2 = t2 * t2 * gi2.dot3(x2, y2, z2);
  }
  var t3 = 0.6 - x3 * x3 - y3 * y3 - z3 * z3;
  if (t3 < 0) {
    n3 = 0;
  } else {
    t3 *= t3;
    n3 = t3 * t3 * gi3.dot3(x3, y3, z3);
  }
  return 32 * (n0 + n1 + n2 + n3);
};
var perlin2 = function perlin22(x, y) {
  var X = Math.floor(x), Y = Math.floor(y);
  x = x - X;
  y = y - Y;
  X = X & 255;
  Y = Y & 255;
  var n00 = gradP[X + perm[Y]].dot2(x, y);
  var n01 = gradP[X + perm[Y + 1]].dot2(x, y - 1);
  var n10 = gradP[X + 1 + perm[Y]].dot2(x - 1, y);
  var n11 = gradP[X + 1 + perm[Y + 1]].dot2(x - 1, y - 1);
  var u = fade(x);
  return lerp(lerp(n00, n10, u), lerp(n01, n11, u), fade(y));
};
var perlin3 = function perlin32(x, y, z2) {
  var X = Math.floor(x), Y = Math.floor(y), Z2 = Math.floor(z2);
  x = x - X;
  y = y - Y;
  z2 = z2 - Z2;
  X = X & 255;
  Y = Y & 255;
  Z2 = Z2 & 255;
  var n000 = gradP[X + perm[Y + perm[Z2]]].dot3(x, y, z2);
  var n001 = gradP[X + perm[Y + perm[Z2 + 1]]].dot3(x, y, z2 - 1);
  var n010 = gradP[X + perm[Y + 1 + perm[Z2]]].dot3(x, y - 1, z2);
  var n011 = gradP[X + perm[Y + 1 + perm[Z2 + 1]]].dot3(x, y - 1, z2 - 1);
  var n100 = gradP[X + 1 + perm[Y + perm[Z2]]].dot3(x - 1, y, z2);
  var n101 = gradP[X + 1 + perm[Y + perm[Z2 + 1]]].dot3(x - 1, y, z2 - 1);
  var n110 = gradP[X + 1 + perm[Y + 1 + perm[Z2]]].dot3(x - 1, y - 1, z2);
  var n111 = gradP[X + 1 + perm[Y + 1 + perm[Z2 + 1]]].dot3(x - 1, y - 1, z2 - 1);
  var u = fade(x);
  var v3 = fade(y);
  var w2 = fade(z2);
  return lerp(lerp(lerp(n000, n100, u), lerp(n001, n101, u), w2), lerp(lerp(n010, n110, u), lerp(n011, n111, u), w2), v3);
};
var noise = Object.freeze({
  __proto__: null,
  seed,
  simplex2,
  simplex3,
  perlin2,
  perlin3
});
var TAU = Math.PI * 2;
function normalizeSeed(seed3) {
  if (typeof seed3 === "number") {
    seed3 = Math.abs(seed3);
  } else if (typeof seed3 === "string") {
    var string = seed3;
    seed3 = 0;
    for (var i = 0; i < string.length; i++) {
      seed3 = (seed3 + (i + 1) * (string.charCodeAt(i) % 96)) % 2147483647;
    }
  }
  if (seed3 === 0) {
    seed3 = 311;
  }
  return seed3;
}
function lcgRandom(seed3) {
  var state = normalizeSeed(seed3);
  return function() {
    var result = state * 48271 % 2147483647;
    state = result;
    return result / 2147483647;
  };
}
var Generator = function Generator2(_seed) {
  var _this = this;
  _classCallCheck(this, Generator2);
  _defineProperty(this, "seed", 0);
  _defineProperty(this, "init", function(seed3) {
    _this.seed = seed3;
    _this.value = lcgRandom(seed3);
  });
  _defineProperty(this, "value", lcgRandom(this.seed));
  this.init(_seed);
};
var defaultGen = new Generator(Math.random());
var defaultSphere = {
  radius: 1,
  center: [0, 0, 0]
};
function onSphere(buffer2, sphere) {
  var rng = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : defaultGen;
  var _defaultSphere$sphere = _objectSpread2(_objectSpread2({}, defaultSphere), sphere), radius = _defaultSphere$sphere.radius, center2 = _defaultSphere$sphere.center;
  for (var i = 0; i < buffer2.length; i += 3) {
    var u = rng.value();
    var v3 = rng.value();
    var theta = Math.acos(2 * v3 - 1);
    var phi = TAU * u;
    buffer2[i] = Math.sin(theta) * Math.cos(phi) * radius + center2[0];
    buffer2[i + 1] = Math.sin(theta) * Math.sin(phi) * radius + center2[1];
    buffer2[i + 2] = Math.cos(theta) * radius + center2[2];
  }
  return buffer2;
}
function inSphere(buffer2, sphere) {
  var rng = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : defaultGen;
  var _defaultSphere$sphere2 = _objectSpread2(_objectSpread2({}, defaultSphere), sphere), radius = _defaultSphere$sphere2.radius, center2 = _defaultSphere$sphere2.center;
  for (var i = 0; i < buffer2.length; i += 3) {
    var u = Math.pow(rng.value(), 1 / 3);
    var x = rng.value() * 2 - 1;
    var y = rng.value() * 2 - 1;
    var z2 = rng.value() * 2 - 1;
    var mag = Math.sqrt(x * x + y * y + z2 * z2);
    x = u * x / mag;
    y = u * y / mag;
    z2 = u * z2 / mag;
    buffer2[i] = x * radius + center2[0];
    buffer2[i + 1] = y * radius + center2[1];
    buffer2[i + 2] = z2 * radius + center2[2];
  }
  return buffer2;
}
var defaultCircle = {
  radius: 1,
  center: [0, 0]
};
function inCircle(buffer2, circle) {
  var rng = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : defaultGen;
  var _defaultCircle$circle = _objectSpread2(_objectSpread2({}, defaultCircle), circle), radius = _defaultCircle$circle.radius, center2 = _defaultCircle$circle.center;
  for (var i = 0; i < buffer2.length; i += 2) {
    var r = radius * Math.sqrt(rng.value());
    var theta = rng.value() * TAU;
    buffer2[i] = Math.sin(theta) * r + center2[0];
    buffer2[i + 1] = Math.cos(theta) * r + center2[1];
  }
  return buffer2;
}
function onCircle(buffer2, circle) {
  var rng = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : defaultGen;
  var _defaultCircle$circle2 = _objectSpread2(_objectSpread2({}, defaultCircle), circle), radius = _defaultCircle$circle2.radius, center2 = _defaultCircle$circle2.center;
  for (var i = 0; i < buffer2.length; i += 2) {
    var theta = rng.value() * TAU;
    buffer2[i] = Math.sin(theta) * radius + center2[0];
    buffer2[i + 1] = Math.cos(theta) * radius + center2[1];
  }
  return buffer2;
}
var defaultRect = {
  sides: 1,
  center: [0, 0]
};
function inRect(buffer2, rect) {
  var rng = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : defaultGen;
  var _defaultRect$rect = _objectSpread2(_objectSpread2({}, defaultRect), rect), sides = _defaultRect$rect.sides, center2 = _defaultRect$rect.center;
  var sideX = typeof sides === "number" ? sides : sides[0];
  var sideY = typeof sides === "number" ? sides : sides[1];
  for (var i = 0; i < buffer2.length; i += 2) {
    buffer2[i] = (rng.value() - 0.5) * sideX + center2[0];
    buffer2[i + 1] = (rng.value() - 0.5) * sideY + center2[1];
  }
  return buffer2;
}
function onRect(buffer2, rect) {
  return buffer2;
}
function inBox(buffer2, box) {
  var rng = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : defaultGen;
  var _defaultBox$box = _objectSpread2(_objectSpread2({}, defaultBox), box), sides = _defaultBox$box.sides, center2 = _defaultBox$box.center;
  var sideX = typeof sides === "number" ? sides : sides[0];
  var sideY = typeof sides === "number" ? sides : sides[1];
  var sideZ = typeof sides === "number" ? sides : sides[2];
  for (var i = 0; i < buffer2.length; i += 3) {
    buffer2[i] = (rng.value() - 0.5) * sideX + center2[0];
    buffer2[i + 1] = (rng.value() - 0.5) * sideY + center2[1];
    buffer2[i + 2] = (rng.value() - 0.5) * sideZ + center2[2];
  }
  return buffer2;
}
var defaultBox = {
  sides: 1,
  center: [0, 0, 0]
};
function onBox(buffer2, box) {
  var rng = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : defaultGen;
  var _defaultBox$box2 = _objectSpread2(_objectSpread2({}, defaultBox), box), sides = _defaultBox$box2.sides, center2 = _defaultBox$box2.center;
  var sideX = typeof sides === "number" ? sides : sides[0];
  var sideY = typeof sides === "number" ? sides : sides[1];
  var sideZ = typeof sides === "number" ? sides : sides[2];
  for (var i = 0; i < buffer2.length; i += 3) {
    buffer2[i] = (rng.value() - 0.5) * sideX + center2[0];
    buffer2[i + 1] = (rng.value() - 0.5) * sideY + center2[1];
    buffer2[i + 2] = (rng.value() - 0.5) * sideZ + center2[2];
  }
  return buffer2;
}
var index = Object.freeze({
  __proto__: null,
  Generator,
  onSphere,
  inSphere,
  inCircle,
  onCircle,
  inRect,
  onRect,
  inBox,
  onBox,
  noise
});

// node_modules/@react-three/postprocessing/node_modules/maath/dist/easing-3be59c6d.esm.js
var rsqw = function rsqw2(t) {
  var delta = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 0.01;
  var a = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : 1;
  var f = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : 1 / (2 * Math.PI);
  return a / Math.atan(1 / delta) * Math.atan(Math.sin(2 * Math.PI * t * f) / delta);
};
var exp = function exp2(t) {
  return 1 / (1 + t + 0.48 * t * t + 0.235 * t * t * t);
};
function damp(current, prop, target) {
  var smoothTime = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : 0.25;
  var delta = arguments.length > 4 && arguments[4] !== void 0 ? arguments[4] : 0.01;
  var maxSpeed = arguments.length > 5 && arguments[5] !== void 0 ? arguments[5] : Infinity;
  var easing2 = arguments.length > 6 && arguments[6] !== void 0 ? arguments[6] : exp;
  var eps = arguments.length > 7 && arguments[7] !== void 0 ? arguments[7] : 1e-3;
  var vel = "velocity_" + prop;
  if (current.__damp === void 0) current.__damp = {};
  if (current.__damp[vel] === void 0) current.__damp[vel] = 0;
  if (Math.abs(current[prop] - target) <= eps) {
    current[prop] = target;
    return false;
  }
  smoothTime = Math.max(1e-4, smoothTime);
  var omega = 2 / smoothTime;
  var t = easing2(omega * delta);
  var change = current[prop] - target;
  var originalTo = target;
  var maxChange = maxSpeed * smoothTime;
  change = Math.min(Math.max(change, -maxChange), maxChange);
  target = current[prop] - change;
  var temp = (current.__damp[vel] + omega * change) * delta;
  current.__damp[vel] = (current.__damp[vel] - omega * temp) * t;
  var output = target + (change + temp) * t;
  if (originalTo - current[prop] > 0 === output > originalTo) {
    output = originalTo;
    current.__damp[vel] = (output - originalTo) / delta;
  }
  current[prop] = output;
  return true;
}
function dampAngle(current, prop, target, smoothTime, delta, maxSpeed, easing2, eps) {
  return damp(current, prop, current[prop] + deltaAngle(current[prop], target), smoothTime, delta, maxSpeed, easing2, eps);
}
var v2d = new Vector2();
var a2;
var b2;
function damp2(current, target, smoothTime, delta, maxSpeed, easing2, eps) {
  if (typeof target === "number") v2d.setScalar(target);
  else if (Array.isArray(target)) v2d.set(target[0], target[1]);
  else v2d.copy(target);
  a2 = damp(current, "x", v2d.x, smoothTime, delta, maxSpeed, easing2, eps);
  b2 = damp(current, "y", v2d.y, smoothTime, delta, maxSpeed, easing2, eps);
  return a2 || b2;
}
var v3d = new Vector3();
var a3;
var b3;
var c3;
function damp3(current, target, smoothTime, delta, maxSpeed, easing2, eps) {
  if (typeof target === "number") v3d.setScalar(target);
  else if (Array.isArray(target)) v3d.set(target[0], target[1], target[2]);
  else v3d.copy(target);
  a3 = damp(current, "x", v3d.x, smoothTime, delta, maxSpeed, easing2, eps);
  b3 = damp(current, "y", v3d.y, smoothTime, delta, maxSpeed, easing2, eps);
  c3 = damp(current, "z", v3d.z, smoothTime, delta, maxSpeed, easing2, eps);
  return a3 || b3 || c3;
}
var v4d = new Vector4();
var a4;
var b4;
var c4;
var d4;
function damp4(current, target, smoothTime, delta, maxSpeed, easing2, eps) {
  if (typeof target === "number") v4d.setScalar(target);
  else if (Array.isArray(target)) v4d.set(target[0], target[1], target[2], target[3]);
  else v4d.copy(target);
  a4 = damp(current, "x", v4d.x, smoothTime, delta, maxSpeed, easing2, eps);
  b4 = damp(current, "y", v4d.y, smoothTime, delta, maxSpeed, easing2, eps);
  c4 = damp(current, "z", v4d.z, smoothTime, delta, maxSpeed, easing2, eps);
  d4 = damp(current, "w", v4d.w, smoothTime, delta, maxSpeed, easing2, eps);
  return a4 || b4 || c4 || d4;
}
var rot = new Euler();
var aE;
var bE;
var cE;
function dampE(current, target, smoothTime, delta, maxSpeed, easing2, eps) {
  if (Array.isArray(target)) rot.set(target[0], target[1], target[2], target[3]);
  else rot.copy(target);
  aE = dampAngle(current, "x", rot.x, smoothTime, delta, maxSpeed, easing2, eps);
  bE = dampAngle(current, "y", rot.y, smoothTime, delta, maxSpeed, easing2, eps);
  cE = dampAngle(current, "z", rot.z, smoothTime, delta, maxSpeed, easing2, eps);
  return aE || bE || cE;
}
var col = new Color();
var aC;
var bC;
var cC;
function dampC(current, target, smoothTime, delta, maxSpeed, easing2, eps) {
  if (target instanceof Color) col.copy(target);
  else if (Array.isArray(target)) col.setRGB(target[0], target[1], target[2]);
  else col.set(target);
  aC = damp(current, "r", col.r, smoothTime, delta, maxSpeed, easing2, eps);
  bC = damp(current, "g", col.g, smoothTime, delta, maxSpeed, easing2, eps);
  cC = damp(current, "b", col.b, smoothTime, delta, maxSpeed, easing2, eps);
  return aC || bC || cC;
}
var qt = new Quaternion();
var v4result = new Vector4();
var v4velocity = new Vector4();
var v4error = new Vector4();
var aQ;
var bQ;
var cQ;
var dQ;
function dampQ(current, target, smoothTime, delta, maxSpeed, easing2, eps) {
  var cur = current;
  if (Array.isArray(target)) qt.set(target[0], target[1], target[2], target[3]);
  else qt.copy(target);
  var multi = current.dot(qt) > 0 ? 1 : -1;
  qt.x *= multi;
  qt.y *= multi;
  qt.z *= multi;
  qt.w *= multi;
  aQ = damp(current, "x", qt.x, smoothTime, delta, maxSpeed, easing2, eps);
  bQ = damp(current, "y", qt.y, smoothTime, delta, maxSpeed, easing2, eps);
  cQ = damp(current, "z", qt.z, smoothTime, delta, maxSpeed, easing2, eps);
  dQ = damp(current, "w", qt.w, smoothTime, delta, maxSpeed, easing2, eps);
  v4result.set(current.x, current.y, current.z, current.w).normalize();
  v4velocity.set(cur.__damp.velocity_x, cur.__damp.velocity_y, cur.__damp.velocity_z, cur.__damp.velocity_w);
  v4error.copy(v4result).multiplyScalar(v4velocity.dot(v4result) / v4result.dot(v4result));
  cur.__damp.velocity_x -= v4error.x;
  cur.__damp.velocity_y -= v4error.y;
  cur.__damp.velocity_z -= v4error.z;
  cur.__damp.velocity_w -= v4error.w;
  current.set(v4result.x, v4result.y, v4result.z, v4result.w);
  return aQ || bQ || cQ || dQ;
}
var spherical = new Spherical();
var aS;
var bS;
var cS;
function dampS(current, target, smoothTime, delta, maxSpeed, easing2, eps) {
  if (Array.isArray(target)) spherical.set(target[0], target[1], target[2]);
  else spherical.copy(target);
  aS = damp(current, "radius", spherical.radius, smoothTime, delta, maxSpeed, easing2, eps);
  bS = dampAngle(current, "phi", spherical.phi, smoothTime, delta, maxSpeed, easing2, eps);
  cS = dampAngle(current, "theta", spherical.theta, smoothTime, delta, maxSpeed, easing2, eps);
  return aS || bS || cS;
}
var mat = new Matrix4();
var mPos = new Vector3();
var mRot = new Quaternion();
var mSca = new Vector3();
var aM;
var bM;
var cM;
function dampM(current, target, smoothTime, delta, maxSpeed, easing2, eps) {
  var cur = current;
  if (cur.__damp === void 0) {
    cur.__damp = {
      position: new Vector3(),
      rotation: new Quaternion(),
      scale: new Vector3()
    };
    current.decompose(cur.__damp.position, cur.__damp.rotation, cur.__damp.scale);
  }
  if (Array.isArray(target)) mat.set.apply(mat, _toConsumableArray(target));
  else mat.copy(target);
  mat.decompose(mPos, mRot, mSca);
  aM = damp3(cur.__damp.position, mPos, smoothTime, delta, maxSpeed, easing2, eps);
  bM = dampQ(cur.__damp.rotation, mRot, smoothTime, delta, maxSpeed, easing2, eps);
  cM = damp3(cur.__damp.scale, mSca, smoothTime, delta, maxSpeed, easing2, eps);
  current.compose(cur.__damp.position, cur.__damp.rotation, cur.__damp.scale);
  return aM || bM || cM;
}
var easing = Object.freeze({
  __proto__: null,
  rsqw,
  exp,
  damp,
  dampAngle,
  damp2,
  damp3,
  damp4,
  dampE,
  dampC,
  dampQ,
  dampS,
  dampM
});

// node_modules/@react-three/postprocessing/node_modules/maath/dist/geometry-982366ff.esm.js
function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function");
  }
  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      writable: true,
      configurable: true
    }
  });
  if (superClass) _setPrototypeOf(subClass, superClass);
}
function _getPrototypeOf(o) {
  _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf2(o2) {
    return o2.__proto__ || Object.getPrototypeOf(o2);
  };
  return _getPrototypeOf(o);
}
function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }
  return self;
}
function _possibleConstructorReturn(self, call) {
  if (call && (typeof call === "object" || typeof call === "function")) {
    return call;
  } else if (call !== void 0) {
    throw new TypeError("Derived constructors may only return object or undefined");
  }
  return _assertThisInitialized(self);
}
function _createSuper(Derived) {
  var hasNativeReflectConstruct = _isNativeReflectConstruct();
  return function _createSuperInternal() {
    var Super = _getPrototypeOf(Derived), result;
    if (hasNativeReflectConstruct) {
      var NewTarget = _getPrototypeOf(this).constructor;
      result = Reflect.construct(Super, arguments, NewTarget);
    } else {
      result = Super.apply(this, arguments);
    }
    return _possibleConstructorReturn(this, result);
  };
}
var RoundedPlaneGeometry = function(_THREE$BufferGeometry) {
  _inherits(RoundedPlaneGeometry2, _THREE$BufferGeometry);
  var _super = _createSuper(RoundedPlaneGeometry2);
  function RoundedPlaneGeometry2() {
    var _this;
    var width = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : 2;
    var height = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 1;
    var radius = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : 0.2;
    var segments = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : 16;
    _classCallCheck(this, RoundedPlaneGeometry2);
    _this = _super.call(this);
    var wi = width / 2 - radius;
    var hi = height / 2 - radius;
    var ul = radius / width;
    var ur = (width - radius) / width;
    var vl = radius / height;
    var vh = (height - radius) / height;
    var positions = [wi, hi, 0, -wi, hi, 0, -wi, -hi, 0, wi, -hi, 0];
    var uvs = [ur, vh, ul, vh, ul, vl, ur, vl];
    var n = [3 * (segments + 1) + 3, 3 * (segments + 1) + 4, segments + 4, segments + 5, 2 * (segments + 1) + 4, 2, 1, 2 * (segments + 1) + 3, 3, 4 * (segments + 1) + 3, 4, 0];
    var indices = [n[0], n[1], n[2], n[0], n[2], n[3], n[4], n[5], n[6], n[4], n[6], n[7], n[8], n[9], n[10], n[8], n[10], n[11]];
    var phi, cos, sin, xc, yc, uc, vc, idx;
    for (var i = 0; i < 4; i++) {
      xc = i < 1 || i > 2 ? wi : -wi;
      yc = i < 2 ? hi : -hi;
      uc = i < 1 || i > 2 ? ur : ul;
      vc = i < 2 ? vh : vl;
      for (var j2 = 0; j2 <= segments; j2++) {
        phi = Math.PI / 2 * (i + j2 / segments);
        cos = Math.cos(phi);
        sin = Math.sin(phi);
        positions.push(xc + radius * cos, yc + radius * sin, 0);
        uvs.push(uc + ul * cos, vc + vl * sin);
        if (j2 < segments) {
          idx = (segments + 1) * i + j2 + 4;
          indices.push(i, idx, idx + 1);
        }
      }
    }
    _this.setIndex(new BufferAttribute(new Uint32Array(indices), 1));
    _this.setAttribute("position", new BufferAttribute(new Float32Array(positions), 3));
    _this.setAttribute("uv", new BufferAttribute(new Float32Array(uvs), 2));
    return _this;
  }
  return RoundedPlaneGeometry2;
}(BufferGeometry);
function applySphereUV(bufferGeometry) {
  var uvs = [];
  var vertices = [];
  for (var i = 0; i < bufferGeometry.attributes.position.array.length / 3; i++) {
    var x = bufferGeometry.attributes.position.array[i * 3 + 0];
    var y = bufferGeometry.attributes.position.array[i * 3 + 1];
    var z2 = bufferGeometry.attributes.position.array[i * 3 + 2];
    vertices.push(new Vector3(x, y, z2));
  }
  var polarVertices = vertices.map(cartesian2polar);
  for (var _i = 0; _i < polarVertices.length / 3; _i++) {
    var tri = new Triangle(vertices[_i * 3 + 0], vertices[_i * 3 + 1], vertices[_i * 3 + 2]);
    var normal = tri.getNormal(new Vector3());
    for (var f = 0; f < 3; f++) {
      var vertex = polarVertices[_i * 3 + f];
      if (vertex.theta === 0 && (vertex.phi === 0 || vertex.phi === Math.PI)) {
        var alignedVertice = vertex.phi === 0 ? _i * 3 + 1 : _i * 3 + 0;
        vertex = {
          r: vertex.r,
          phi: vertex.phi,
          theta: polarVertices[alignedVertice].theta
        };
      }
      if (vertex.theta === Math.PI && cartesian2polar(normal).theta < Math.PI / 2) {
        vertex.theta = -Math.PI;
      }
      var canvasPoint = polar2canvas(vertex);
      uvs.push(1 - canvasPoint.x, 1 - canvasPoint.y);
    }
  }
  if (bufferGeometry.attributes.uv) delete bufferGeometry.attributes.uv;
  bufferGeometry.setAttribute("uv", new Float32BufferAttribute(uvs, 2));
  bufferGeometry.attributes.uv.needsUpdate = true;
  return bufferGeometry;
}
function cartesian2polar(position) {
  var r = Math.sqrt(position.x * position.x + position.z * position.z + position.y * position.y);
  return {
    r,
    phi: Math.acos(position.y / r),
    theta: Math.atan2(position.z, position.x)
  };
}
function polar2canvas(polarPoint) {
  return {
    y: polarPoint.phi / Math.PI,
    x: (polarPoint.theta + Math.PI) / (2 * Math.PI)
  };
}
function applyBoxUV(bufferGeometry) {
  bufferGeometry.computeBoundingBox();
  var bboxSize = bufferGeometry.boundingBox.getSize(new Vector3());
  var boxSize = Math.min(bboxSize.x, bboxSize.y, bboxSize.z);
  var boxGeometry = new BoxGeometry(boxSize, boxSize, boxSize);
  var cube = new Mesh(boxGeometry);
  cube.rotation.set(0, 0, 0);
  cube.updateWorldMatrix(true, false);
  var transformMatrix = cube.matrix.clone().invert();
  var uvBbox = new Box3(new Vector3(-boxSize / 2, -boxSize / 2, -boxSize / 2), new Vector3(boxSize / 2, boxSize / 2, boxSize / 2));
  _applyBoxUV(bufferGeometry, transformMatrix, uvBbox, boxSize);
  bufferGeometry.attributes.uv.needsUpdate = true;
  return bufferGeometry;
}
function _applyBoxUV(geom, transformMatrix, bbox, bbox_max_size) {
  var coords = [];
  coords.length = 2 * geom.attributes.position.array.length / 3;
  var makeUVs = function makeUVs2(v02, v12, v23) {
    v02.applyMatrix4(transformMatrix);
    v12.applyMatrix4(transformMatrix);
    v23.applyMatrix4(transformMatrix);
    var n = new Vector3();
    n.crossVectors(v12.clone().sub(v02), v12.clone().sub(v23)).normalize();
    n.x = Math.abs(n.x);
    n.y = Math.abs(n.y);
    n.z = Math.abs(n.z);
    var uv0 = new Vector2();
    var uv1 = new Vector2();
    var uv2 = new Vector2();
    if (n.y > n.x && n.y > n.z) {
      uv0.x = (v02.x - bbox.min.x) / bbox_max_size;
      uv0.y = (bbox.max.z - v02.z) / bbox_max_size;
      uv1.x = (v12.x - bbox.min.x) / bbox_max_size;
      uv1.y = (bbox.max.z - v12.z) / bbox_max_size;
      uv2.x = (v23.x - bbox.min.x) / bbox_max_size;
      uv2.y = (bbox.max.z - v23.z) / bbox_max_size;
    } else if (n.x > n.y && n.x > n.z) {
      uv0.x = (v02.z - bbox.min.z) / bbox_max_size;
      uv0.y = (v02.y - bbox.min.y) / bbox_max_size;
      uv1.x = (v12.z - bbox.min.z) / bbox_max_size;
      uv1.y = (v12.y - bbox.min.y) / bbox_max_size;
      uv2.x = (v23.z - bbox.min.z) / bbox_max_size;
      uv2.y = (v23.y - bbox.min.y) / bbox_max_size;
    } else if (n.z > n.y && n.z > n.x) {
      uv0.x = (v02.x - bbox.min.x) / bbox_max_size;
      uv0.y = (v02.y - bbox.min.y) / bbox_max_size;
      uv1.x = (v12.x - bbox.min.x) / bbox_max_size;
      uv1.y = (v12.y - bbox.min.y) / bbox_max_size;
      uv2.x = (v23.x - bbox.min.x) / bbox_max_size;
      uv2.y = (v23.y - bbox.min.y) / bbox_max_size;
    }
    return {
      uv0,
      uv1,
      uv2
    };
  };
  if (geom.index) {
    for (var vi = 0; vi < geom.index.array.length; vi += 3) {
      var idx0 = geom.index.array[vi];
      var idx1 = geom.index.array[vi + 1];
      var idx2 = geom.index.array[vi + 2];
      var vx0 = geom.attributes.position.array[3 * idx0];
      var vy0 = geom.attributes.position.array[3 * idx0 + 1];
      var vz0 = geom.attributes.position.array[3 * idx0 + 2];
      var vx1 = geom.attributes.position.array[3 * idx1];
      var vy1 = geom.attributes.position.array[3 * idx1 + 1];
      var vz1 = geom.attributes.position.array[3 * idx1 + 2];
      var vx2 = geom.attributes.position.array[3 * idx2];
      var vy2 = geom.attributes.position.array[3 * idx2 + 1];
      var vz2 = geom.attributes.position.array[3 * idx2 + 2];
      var v0 = new Vector3(vx0, vy0, vz0);
      var v1 = new Vector3(vx1, vy1, vz1);
      var v22 = new Vector3(vx2, vy2, vz2);
      var uvs = makeUVs(v0, v1, v22);
      coords[2 * idx0] = uvs.uv0.x;
      coords[2 * idx0 + 1] = uvs.uv0.y;
      coords[2 * idx1] = uvs.uv1.x;
      coords[2 * idx1 + 1] = uvs.uv1.y;
      coords[2 * idx2] = uvs.uv2.x;
      coords[2 * idx2 + 1] = uvs.uv2.y;
    }
  } else {
    for (var _vi = 0; _vi < geom.attributes.position.array.length; _vi += 9) {
      var _vx = geom.attributes.position.array[_vi];
      var _vy = geom.attributes.position.array[_vi + 1];
      var _vz = geom.attributes.position.array[_vi + 2];
      var _vx2 = geom.attributes.position.array[_vi + 3];
      var _vy2 = geom.attributes.position.array[_vi + 4];
      var _vz2 = geom.attributes.position.array[_vi + 5];
      var _vx3 = geom.attributes.position.array[_vi + 6];
      var _vy3 = geom.attributes.position.array[_vi + 7];
      var _vz3 = geom.attributes.position.array[_vi + 8];
      var _v = new Vector3(_vx, _vy, _vz);
      var _v2 = new Vector3(_vx2, _vy2, _vz2);
      var _v3 = new Vector3(_vx3, _vy3, _vz3);
      var _uvs = makeUVs(_v, _v2, _v3);
      var _idx = _vi / 3;
      var _idx2 = _idx + 1;
      var _idx3 = _idx + 2;
      coords[2 * _idx] = _uvs.uv0.x;
      coords[2 * _idx + 1] = _uvs.uv0.y;
      coords[2 * _idx2] = _uvs.uv1.x;
      coords[2 * _idx2 + 1] = _uvs.uv1.y;
      coords[2 * _idx3] = _uvs.uv2.x;
      coords[2 * _idx3 + 1] = _uvs.uv2.y;
    }
  }
  if (geom.attributes.uv) delete geom.attributes.uv;
  geom.setAttribute("uv", new Float32BufferAttribute(coords, 2));
}
var geometry = Object.freeze({
  __proto__: null,
  RoundedPlaneGeometry,
  applySphereUV,
  applyBoxUV
});

// node_modules/@react-three/postprocessing/node_modules/maath/dist/three-eb2ad8c0.esm.js
function bufferToVectors(buffer2) {
  var stride = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 3;
  var p2 = [];
  for (var i = 0, j2 = 0; i < buffer2.length; i += stride, j2++) {
    if (stride === 3) {
      p2[j2] = new Vector3(buffer2[i], buffer2[i + 1], buffer2[i + 2]);
    } else {
      p2[j2] = new Vector2(buffer2[i], buffer2[i + 1]);
    }
  }
  return p2;
}
function vectorsToBuffer(vectorArray) {
  var l = vectorArray.length;
  var stride = vectorArray[0].hasOwnProperty("z") ? 3 : 2;
  var buffer2 = new Float32Array(l * stride);
  for (var i = 0; i < l; i++) {
    var j2 = i * stride;
    buffer2[j2] = vectorArray[i].x;
    buffer2[j2 + 1] = vectorArray[i].y;
    if (stride === 3) {
      buffer2[j2 + 2] = vectorArray[i].z;
    }
  }
  return buffer2;
}
var three = Object.freeze({
  __proto__: null,
  bufferToVectors,
  vectorsToBuffer
});

// node_modules/three/examples/jsm/postprocessing/Pass.js
var _camera = new OrthographicCamera(-1, 1, 1, -1, 0, 1);
var FullscreenTriangleGeometry = class extends BufferGeometry {
  constructor() {
    super();
    this.setAttribute("position", new Float32BufferAttribute([-1, 3, 0, -1, -1, 0, 3, -1, 0], 3));
    this.setAttribute("uv", new Float32BufferAttribute([0, 2, 0, 0, 2, 0], 2));
  }
};
var _geometry = new FullscreenTriangleGeometry();

// node_modules/n8ao/dist/N8AO.js
var $e4ca8dcb0218f846$var$FullScreenTriangleGeometry = class extends BufferGeometry {
  boundingSphere = new Sphere();
  constructor() {
    super();
    this.setAttribute("position", new BufferAttribute(new Float32Array([
      -1,
      -1,
      3,
      -1,
      -1,
      3
    ]), 2));
    this.setAttribute("uv", new BufferAttribute(new Float32Array([
      0,
      0,
      2,
      0,
      0,
      2
    ]), 2));
  }
  computeBoundingSphere() {
  }
};
var $e4ca8dcb0218f846$var$_geometry = new $e4ca8dcb0218f846$var$FullScreenTriangleGeometry();
var $e4ca8dcb0218f846$var$_camera = new OrthographicCamera();
var $e4ca8dcb0218f846$export$dcd670d73db751f5 = class {
  constructor(material) {
    this._mesh = new Mesh($e4ca8dcb0218f846$var$_geometry, material);
    this._mesh.frustumCulled = false;
  }
  render(renderer) {
    renderer.render(this._mesh, $e4ca8dcb0218f846$var$_camera);
  }
  get material() {
    return this._mesh.material;
  }
  set material(value) {
    this._mesh.material = value;
  }
  dispose() {
    this._mesh.material.dispose();
    this._mesh.geometry.dispose();
  }
};
var $1ed45968c1160c3c$export$c9b263b9a17dffd7 = {
  uniforms: {
    "sceneDiffuse": {
      value: null
    },
    "sceneDepth": {
      value: null
    },
    "sceneNormal": {
      value: null
    },
    "projMat": {
      value: new Matrix4()
    },
    "viewMat": {
      value: new Matrix4()
    },
    "projViewMat": {
      value: new Matrix4()
    },
    "projectionMatrixInv": {
      value: new Matrix4()
    },
    "viewMatrixInv": {
      value: new Matrix4()
    },
    "cameraPos": {
      value: new Vector3()
    },
    "resolution": {
      value: new Vector2()
    },
    "biasAdjustment": {
      value: new Vector2()
    },
    "time": {
      value: 0
    },
    "samples": {
      value: []
    },
    "bluenoise": {
      value: null
    },
    "distanceFalloff": {
      value: 1
    },
    "radius": {
      value: 5
    },
    "near": {
      value: 0.1
    },
    "far": {
      value: 1e3
    },
    "ortho": {
      value: false
    },
    "screenSpaceRadius": {
      value: false
    },
    "frame": {
      value: 0
    }
  },
  depthWrite: false,
  depthTest: false,
  vertexShader: (
    /* glsl */
    `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position, 1);
}`
  ),
  fragmentShader: (
    /* glsl */
    `
    #define SAMPLES 16
    #define FSAMPLES 16.0
uniform sampler2D sceneDiffuse;
uniform highp sampler2D sceneNormal;
uniform highp sampler2D sceneDepth;
uniform mat4 projectionMatrixInv;
uniform mat4 viewMatrixInv;
uniform mat4 projMat;
uniform mat4 viewMat;
uniform mat4 projViewMat;
uniform vec3 cameraPos;
uniform vec2 resolution;
uniform vec2 biasAdjustment;
uniform float time;
uniform vec3[SAMPLES] samples;
uniform float radius;
uniform float distanceFalloff;
uniform float near;
uniform float far;
uniform float frame;
uniform bool ortho;
uniform bool screenSpaceRadius;
uniform sampler2D bluenoise;
    varying vec2 vUv;
    highp float linearize_depth(highp float d, highp float zNear,highp float zFar)
    {
        return (zFar * zNear) / (zFar - d * (zFar - zNear));
    }
    highp float linearize_depth_ortho(highp float d, highp float nearZ, highp float farZ) {
      return nearZ + (farZ - nearZ) * d;
    }
    highp float linearize_depth_log(highp float d, highp float nearZ,highp float farZ) {
      float depth = pow(2.0, d * log2(farZ + 1.0)) - 1.0;
      float a = farZ / (farZ - nearZ);
      float b = farZ * nearZ / (nearZ - farZ);
      float linDepth = a + b / depth;
      /*return ortho ? linearize_depth_ortho(
        linDepth,
        nearZ,
        farZ
      ) :linearize_depth(linDepth, nearZ, farZ);*/
       #ifdef ORTHO

       return linearize_depth_ortho(d, nearZ, farZ);

        #else
        return linearize_depth(linDepth, nearZ, farZ);
        #endif
    }

    vec3 getWorldPosLog(vec3 posS) {
      vec2 uv = posS.xy;
      float z = posS.z;
      float nearZ =near;
      float farZ = far;
      float depth = pow(2.0, z * log2(farZ + 1.0)) - 1.0;
      float a = farZ / (farZ - nearZ);
      float b = farZ * nearZ / (nearZ - farZ);
      float linDepth = a + b / depth;
      vec4 clipVec = vec4(uv, linDepth, 1.0) * 2.0 - 1.0;
      vec4 wpos = projectionMatrixInv * clipVec;
      return wpos.xyz / wpos.w;
    }
    vec3 getWorldPos(float depth, vec2 coord) {
      #ifdef LOGDEPTH
        #ifndef ORTHO
          return getWorldPosLog(vec3(coord, depth));
        #endif
      #endif
      float z = depth * 2.0 - 1.0;
      vec4 clipSpacePosition = vec4(coord * 2.0 - 1.0, z, 1.0);
      vec4 viewSpacePosition = projectionMatrixInv * clipSpacePosition;
      // Perspective division
     vec4 worldSpacePosition = viewSpacePosition;
     worldSpacePosition.xyz /= worldSpacePosition.w;
      return worldSpacePosition.xyz;
  }

  vec3 computeNormal(vec3 worldPos, vec2 vUv) {
    ivec2 p = ivec2(vUv * resolution);
    #ifdef REVERSEDEPTH
    float c0 = 1.0 - texelFetch(sceneDepth, p, 0).x;
    float l2 = 1.0 - texelFetch(sceneDepth, p - ivec2(2, 0), 0).x;
    float l1 = 1.0 - texelFetch(sceneDepth, p - ivec2(1, 0), 0).x;
    float r1 = 1.0 - texelFetch(sceneDepth, p + ivec2(1, 0), 0).x;
    float r2 = 1.0 - texelFetch(sceneDepth, p + ivec2(2, 0), 0).x;
    float b2 = 1.0 - texelFetch(sceneDepth, p - ivec2(0, 2), 0).x;
    float b1 = 1.0 - texelFetch(sceneDepth, p - ivec2(0, 1), 0).x;
    float t1 = 1.0 - texelFetch(sceneDepth, p + ivec2(0, 1), 0).x;
    float t2 = 1.0 - texelFetch(sceneDepth, p + ivec2(0, 2), 0).x;
    #else
    float c0 = texelFetch(sceneDepth, p, 0).x;
    float l2 = texelFetch(sceneDepth, p - ivec2(2, 0), 0).x;
    float l1 = texelFetch(sceneDepth, p - ivec2(1, 0), 0).x;
    float r1 = texelFetch(sceneDepth, p + ivec2(1, 0), 0).x;
    float r2 = texelFetch(sceneDepth, p + ivec2(2, 0), 0).x;
    float b2 = texelFetch(sceneDepth, p - ivec2(0, 2), 0).x;
    float b1 = texelFetch(sceneDepth, p - ivec2(0, 1), 0).x;
    float t1 = texelFetch(sceneDepth, p + ivec2(0, 1), 0).x;
    float t2 = texelFetch(sceneDepth, p + ivec2(0, 2), 0).x;
    #endif

    float dl = abs((2.0 * l1 - l2) - c0);
    float dr = abs((2.0 * r1 - r2) - c0);
    float db = abs((2.0 * b1 - b2) - c0);
    float dt = abs((2.0 * t1 - t2) - c0);

    vec3 ce = getWorldPos(c0, vUv).xyz;

    vec3 dpdx = (dl < dr) ? ce - getWorldPos(l1, (vUv - vec2(1.0 / resolution.x, 0.0))).xyz
                          : -ce + getWorldPos(r1, (vUv + vec2(1.0 / resolution.x, 0.0))).xyz;
    vec3 dpdy = (db < dt) ? ce - getWorldPos(b1, (vUv - vec2(0.0, 1.0 / resolution.y))).xyz
                          : -ce + getWorldPos(t1, (vUv + vec2(0.0, 1.0 / resolution.y))).xyz;

    return normalize(cross(dpdx, dpdy));
}

mat3 makeRotationZ(float theta) {
	float c = cos(theta);
	float s = sin(theta);
	return mat3(c, - s, 0,
			s,  c, 0,
			0,  0, 1);
  }

void main() {
      vec4 diffuse = texture2D(sceneDiffuse, vUv);
      #ifdef REVERSEDEPTH
      float depth = 1.0 - texture2D(sceneDepth, vUv).x;
      #else
      float depth = texture2D(sceneDepth, vUv).x;
      #endif
      if (depth == 1.0) {
        gl_FragColor = vec4(vec3(1.0), 1.0);
        return;
      }
      vec3 worldPos = getWorldPos(depth, vUv);
      #ifdef HALFRES
        vec3 normal = texture2D(sceneNormal, vUv).rgb;
      #else
        vec3 normal = computeNormal(worldPos, vUv);
      #endif
      vec4 noise = texture2D(bluenoise, gl_FragCoord.xy / 128.0);
      vec2 harmoniousNumbers = vec2(
        1.618033988749895,
        1.324717957244746
      );
      noise.rg += harmoniousNumbers * frame;
      noise.rg = fract(noise.rg);
        vec3 helperVec = vec3(0.0, 1.0, 0.0);
        if (dot(helperVec, normal) > 0.99) {
          helperVec = vec3(1.0, 0.0, 0.0);
        }
        vec3 tangent = normalize(cross(helperVec, normal));
        vec3 bitangent = cross(normal, tangent);
        mediump mat3 tbn = mat3(tangent, bitangent, normal) *  makeRotationZ( noise.r * 3.1415962 * 2.0) ;

      mediump float occluded = 0.0;
      mediump float totalWeight = 0.0;
      float radiusToUse = screenSpaceRadius ? distance(
        worldPos,
        getWorldPos(depth, vUv +
          vec2(radius, 0.0) / resolution)
      ) : radius;
      float distanceFalloffToUse =screenSpaceRadius ?
          radiusToUse * distanceFalloff
      : radiusToUse * distanceFalloff * 0.2;
      float bias = (min(
        0.1,
        distanceFalloffToUse * 0.1
      ) / near) * fwidth(distance(worldPos, cameraPos)) / radiusToUse;
      bias = biasAdjustment.x + biasAdjustment.y * bias;
      mediump float offsetMove = noise.g;
      mediump float offsetMoveInv = 1.0 / FSAMPLES;
      float farTimesNear = far * near;
      float farMinusNear = far - near;
      
      for(int i = 0; i < SAMPLES; i++) {
        mediump vec3 sampleDirection = tbn * samples[i];

        float moveAmt = fract(offsetMove);
        offsetMove += offsetMoveInv;
        vec3 samplePos = worldPos + radiusToUse * moveAmt * sampleDirection;
        vec4 offset = projMat * vec4(samplePos, 1.0);
        offset.xyz /= offset.w;
        offset.xyz = offset.xyz * 0.5 + 0.5;
        
        if (all(greaterThan(offset.xyz * (1.0 - offset.xyz), vec3(0.0)))) {
          #ifdef REVERSEDEPTH
          float sampleDepth = 1.0 - textureLod(sceneDepth, offset.xy, 0.0).x;
          #else
          float sampleDepth = textureLod(sceneDepth, offset.xy, 0.0).x;
          #endif

          /*#ifdef LOGDEPTH
          float distSample = linearize_depth_log(sampleDepth, near, far);
      #else
          #ifdef ORTHO
              float distSample = near + farMinusNear * sampleDepth;
          #else
              float distSample = (farTimesNear) / (far - sampleDepth * farMinusNear);
          #endif
      #endif*/
      #ifdef ORTHO
          float distSample = near + sampleDepth * farMinusNear;
      #else
          #ifdef LOGDEPTH
              float distSample = linearize_depth_log(sampleDepth, near, far);
          #else
              float distSample = (farTimesNear) / (far - sampleDepth * farMinusNear);
          #endif
      #endif
      
      #ifdef ORTHO
          float distWorld = near + offset.z * farMinusNear;
      #else
          float distWorld = (farTimesNear) / (far - offset.z * farMinusNear);
      #endif
          
          mediump float rangeCheck = smoothstep(0.0, 1.0, distanceFalloffToUse / (abs(distSample - distWorld)));
          vec2 diff = gl_FragCoord.xy - floor(offset.xy * resolution);
          occluded += rangeCheck * float(distSample != distWorld) * float(sampleDepth != depth) * step(distSample + bias, distWorld) * step(
            1.0,
            dot(diff, diff)
          );
          
          totalWeight ++;
        }
      }
      float occ = clamp(1.0 - occluded / (totalWeight == 0.0 ? 1.0 : totalWeight), 0.0, 1.0);
      gl_FragColor = vec4(occ, 0.5 + 0.5 * normal);
}`
  )
};
var $12b21d24d1192a04$export$a815acccbd2c9a49 = {
  uniforms: {
    "sceneDiffuse": {
      value: null
    },
    "sceneDepth": {
      value: null
    },
    "tDiffuse": {
      value: null
    },
    "transparencyDWFalse": {
      value: null
    },
    "transparencyDWTrue": {
      value: null
    },
    "transparencyDWTrueDepth": {
      value: null
    },
    "transparencyAware": {
      value: false
    },
    "projMat": {
      value: new Matrix4()
    },
    "viewMat": {
      value: new Matrix4()
    },
    "projectionMatrixInv": {
      value: new Matrix4()
    },
    "viewMatrixInv": {
      value: new Matrix4()
    },
    "cameraPos": {
      value: new Vector3()
    },
    "resolution": {
      value: new Vector2()
    },
    "color": {
      value: new Vector3(0, 0, 0)
    },
    "blueNoise": {
      value: null
    },
    "downsampledDepth": {
      value: null
    },
    "time": {
      value: 0
    },
    "intensity": {
      value: 10
    },
    "renderMode": {
      value: 0
    },
    "gammaCorrection": {
      value: false
    },
    "ortho": {
      value: false
    },
    "near": {
      value: 0.1
    },
    "far": {
      value: 1e3
    },
    "screenSpaceRadius": {
      value: false
    },
    "radius": {
      value: 0
    },
    "distanceFalloff": {
      value: 1
    },
    "fog": {
      value: false
    },
    "fogExp": {
      value: false
    },
    "fogDensity": {
      value: 0
    },
    "fogNear": {
      value: Infinity
    },
    "fogFar": {
      value: Infinity
    },
    "colorMultiply": {
      value: true
    },
    "aoTones": {
      value: 0
    }
  },
  depthWrite: false,
  depthTest: false,
  vertexShader: (
    /* glsl */
    `
		varying vec2 vUv;
		void main() {
			vUv = uv;
			gl_Position = vec4(position, 1);
		}`
  ),
  fragmentShader: (
    /* glsl */
    `
		uniform sampler2D sceneDiffuse;
    uniform highp sampler2D sceneDepth;
    uniform highp sampler2D downsampledDepth;
    uniform highp sampler2D transparencyDWFalse;
    uniform highp sampler2D transparencyDWTrue;
    uniform highp sampler2D transparencyDWTrueDepth;
    uniform sampler2D tDiffuse;
    uniform sampler2D blueNoise;
    uniform vec2 resolution;
    uniform vec3 color;
    uniform mat4 projectionMatrixInv;
    uniform mat4 viewMatrixInv;
    uniform float intensity;
    uniform float renderMode;
    uniform float near;
    uniform float far;
    uniform float aoTones;
    uniform bool gammaCorrection;
    uniform bool ortho;
    uniform bool screenSpaceRadius;
    uniform bool fog;
    uniform bool fogExp;
    uniform bool colorMultiply;
    uniform bool transparencyAware;
    uniform float fogDensity;
    uniform float fogNear;
    uniform float fogFar;
    uniform float radius;
    uniform float distanceFalloff;
    uniform vec3 cameraPos;
    varying vec2 vUv;
    highp float linearize_depth(highp float d, highp float zNear,highp float zFar)
    {
        return (zFar * zNear) / (zFar - d * (zFar - zNear));
    }
    highp float linearize_depth_ortho(highp float d, highp float nearZ, highp float farZ) {
      return nearZ + (farZ - nearZ) * d;
    }
    highp float linearize_depth_log(highp float d, highp float nearZ,highp float farZ) {
      float depth = pow(2.0, d * log2(farZ + 1.0)) - 1.0;
      float a = farZ / (farZ - nearZ);
      float b = farZ * nearZ / (nearZ - farZ);
      float linDepth = a + b / depth;
      return ortho ? linearize_depth_ortho(
        linDepth,
        nearZ,
        farZ
      ) :linearize_depth(linDepth, nearZ, farZ);
    }
    vec3 getWorldPosLog(vec3 posS) {
        vec2 uv = posS.xy;
        float z = posS.z;
        float nearZ =near;
        float farZ = far;
        float depth = pow(2.0, z * log2(farZ + 1.0)) - 1.0;
        float a = farZ / (farZ - nearZ);
        float b = farZ * nearZ / (nearZ - farZ);
        float linDepth = a + b / depth;
        vec4 clipVec = vec4(uv, linDepth, 1.0) * 2.0 - 1.0;
        vec4 wpos = projectionMatrixInv * clipVec;
        return wpos.xyz / wpos.w;
      }
      vec3 getWorldPos(float depth, vec2 coord) {
        #ifdef LOGDEPTH
          #ifndef ORTHO
            return getWorldPosLog(vec3(coord, depth));
          #endif
        #endif
      //  }
        float z = depth * 2.0 - 1.0;
        vec4 clipSpacePosition = vec4(coord * 2.0 - 1.0, z, 1.0);
        vec4 viewSpacePosition = projectionMatrixInv * clipSpacePosition;
        // Perspective division
       vec4 worldSpacePosition = viewSpacePosition;
       worldSpacePosition.xyz /= worldSpacePosition.w;
        return worldSpacePosition.xyz;
    }
  
    vec3 computeNormal(vec3 worldPos, vec2 vUv) {
      ivec2 p = ivec2(vUv * resolution);
      #ifdef REVERSEDEPTH
      float c0 = 1.0 - texelFetch(sceneDepth, p, 0).x;
      float l2 = 1.0 - texelFetch(sceneDepth, p - ivec2(2, 0), 0).x;
      float l1 = 1.0 - texelFetch(sceneDepth, p - ivec2(1, 0), 0).x;
      float r1 = 1.0 - texelFetch(sceneDepth, p + ivec2(1, 0), 0).x;
      float r2 = 1.0 - texelFetch(sceneDepth, p + ivec2(2, 0), 0).x;
      float b2 = 1.0 - texelFetch(sceneDepth, p - ivec2(0, 2), 0).x;
      float b1 = 1.0 - texelFetch(sceneDepth, p - ivec2(0, 1), 0).x;
      float t1 = 1.0 - texelFetch(sceneDepth, p + ivec2(0, 1), 0).x;
      float t2 = 1.0 - texelFetch(sceneDepth, p + ivec2(0, 2), 0).x;
      #else
      float c0 = texelFetch(sceneDepth, p, 0).x;
      float l2 = texelFetch(sceneDepth, p - ivec2(2, 0), 0).x;
      float l1 = texelFetch(sceneDepth, p - ivec2(1, 0), 0).x;
      float r1 = texelFetch(sceneDepth, p + ivec2(1, 0), 0).x;
      float r2 = texelFetch(sceneDepth, p + ivec2(2, 0), 0).x;
      float b2 = texelFetch(sceneDepth, p - ivec2(0, 2), 0).x;
      float b1 = texelFetch(sceneDepth, p - ivec2(0, 1), 0).x;
      float t1 = texelFetch(sceneDepth, p + ivec2(0, 1), 0).x;
      float t2 = texelFetch(sceneDepth, p + ivec2(0, 2), 0).x;
      #endif
  
      float dl = abs((2.0 * l1 - l2) - c0);
      float dr = abs((2.0 * r1 - r2) - c0);
      float db = abs((2.0 * b1 - b2) - c0);
      float dt = abs((2.0 * t1 - t2) - c0);
  
      vec3 ce = getWorldPos(c0, vUv).xyz;
  
      vec3 dpdx = (dl < dr) ? ce - getWorldPos(l1, (vUv - vec2(1.0 / resolution.x, 0.0))).xyz
                            : -ce + getWorldPos(r1, (vUv + vec2(1.0 / resolution.x, 0.0))).xyz;
      vec3 dpdy = (db < dt) ? ce - getWorldPos(b1, (vUv - vec2(0.0, 1.0 / resolution.y))).xyz
                            : -ce + getWorldPos(t1, (vUv + vec2(0.0, 1.0 / resolution.y))).xyz;
  
      return normalize(cross(dpdx, dpdy));
  }

    #include <common>
    #include <dithering_pars_fragment>
    void main() {
        //vec4 texel = texture2D(tDiffuse, vUv);//vec3(0.0);
        vec4 sceneTexel = texture2D(sceneDiffuse, vUv);
        #ifdef REVERSEDEPTH
        float depth = 1.0 - texture2D(sceneDepth, vUv).x;
        #else
        float depth = texture2D(sceneDepth, vUv).x;
        #endif
        #ifdef HALFRES 
        vec4 texel;
        if (depth == 1.0) {
            texel = vec4(0.0, 0.0, 0.0, 1.0);
        } else {
        vec3 worldPos = getWorldPos(depth, vUv);
        vec3 normal = computeNormal(getWorldPos(depth, vUv), vUv);
       // vec4 texel = texture2D(tDiffuse, vUv);
       // Find closest depth;
       float totalWeight = 0.0;
       float radiusToUse = screenSpaceRadius ? distance(
        worldPos,
        getWorldPos(depth, vUv +
          vec2(radius, 0.0) / resolution)
      ) : radius;
      float distanceFalloffToUse =screenSpaceRadius ?
          radiusToUse * distanceFalloff
      : distanceFalloff;
        for(float x = -1.0; x <= 1.0; x++) {
            for(float y = -1.0; y <= 1.0; y++) {
                vec2 offset = vec2(x, y);
                ivec2 p = ivec2(
                    (vUv * resolution * 0.5) + offset
                );
                vec2 pUv = vec2(p) / (resolution * 0.5);
                float sampleDepth = texelFetch(downsampledDepth,p, 0).x;
                vec4 sampleInfo = texelFetch(tDiffuse, p, 0);
                vec3 normalSample = sampleInfo.gba * 2.0 - 1.0;
                vec3 worldPosSample = getWorldPos(sampleDepth, pUv);
                float tangentPlaneDist = abs(dot(worldPosSample - worldPos, normal));
                float rangeCheck = exp(-1.0 * tangentPlaneDist * (1.0 / distanceFalloffToUse)) * max(dot(normal, normalSample), 0.0);
                float weight = rangeCheck;
                totalWeight += weight;
                texel += sampleInfo * weight;
            }
        }
        if (totalWeight == 0.0) {
            texel = texture2D(tDiffuse, vUv);
        } else {
            texel /= totalWeight;
        }
    }
        #else
        vec4 texel = texture2D(tDiffuse, vUv);
        #endif

        #ifdef LOGDEPTH
        texel.r = clamp(texel.r, 0.0, 1.0);
        if (texel.r == 0.0) {
          texel.r = 1.0;
        }
        #endif
     
        float finalAo = pow(texel.r, intensity);
        if (aoTones > 0.0) {
            finalAo = ceil(finalAo * aoTones) / aoTones;
        }
        float fogFactor;
        float fogDepth = distance(
            cameraPos,
            getWorldPos(depth, vUv)
        );
        if (fog) {
            if (fogExp) {
                fogFactor = 1.0 - exp( - fogDensity * fogDensity * fogDepth * fogDepth );
            } else {
                fogFactor = smoothstep( fogNear, fogFar, fogDepth );
            }
        }
        if (transparencyAware) {
            float transparencyDWOff = texture2D(transparencyDWFalse, vUv).a;
            float transparencyDWOn = texture2D(transparencyDWTrue, vUv).a;
            float adjustmentFactorOff = transparencyDWOff;
            #ifdef REVERSEDEPTH
            float depthSample = 1.0 - texture2D(sceneDepth, vUv).r;
            float trueDepthSample = 1.0 - texture2D(transparencyDWTrueDepth, vUv).r;
            #else
            float depthSample = texture2D(sceneDepth, vUv).r;
            float trueDepthSample = texture2D(transparencyDWTrueDepth, vUv).r;
            #endif
            float adjustmentFactorOn = (1.0 - transparencyDWOn) * (
                trueDepthSample == depthSample ? 1.0 : 0.0
            );
            float adjustmentFactor = max(adjustmentFactorOff, adjustmentFactorOn);
            finalAo = mix(finalAo, 1.0, adjustmentFactor);
        }
        finalAo = mix(finalAo, 1.0, fogFactor);
        vec3 aoApplied = color * mix(vec3(1.0), sceneTexel.rgb, float(colorMultiply));
        if (renderMode == 0.0) {
            gl_FragColor = vec4( mix(sceneTexel.rgb, aoApplied, 1.0 - finalAo), sceneTexel.a);
        } else if (renderMode == 1.0) {
            gl_FragColor = vec4( mix(vec3(1.0), aoApplied, 1.0 - finalAo), sceneTexel.a);
        } else if (renderMode == 2.0) {
            gl_FragColor = vec4( sceneTexel.rgb, sceneTexel.a);
        } else if (renderMode == 3.0) {
            if (vUv.x < 0.5) {
                gl_FragColor = vec4( sceneTexel.rgb, sceneTexel.a);
            } else if (abs(vUv.x - 0.5) < 1.0 / resolution.x) {
                gl_FragColor = vec4(1.0);
            } else {
                gl_FragColor = vec4( mix(sceneTexel.rgb, aoApplied, 1.0 - finalAo), sceneTexel.a);
            }
        } else if (renderMode == 4.0) {
            if (vUv.x < 0.5) {
                gl_FragColor = vec4( sceneTexel.rgb, sceneTexel.a);
            } else if (abs(vUv.x - 0.5) < 1.0 / resolution.x) {
                gl_FragColor = vec4(1.0);
            } else {
                gl_FragColor = vec4( mix(vec3(1.0), aoApplied, 1.0 - finalAo), sceneTexel.a);
            }
        }
        #include <dithering_fragment>
        if (gammaCorrection) {
            gl_FragColor = sRGBTransferOETF(gl_FragColor);
        }
    }
    `
  )
};
var $e52378cd0f5a973d$export$57856b59f317262e = {
  uniforms: {
    "sceneDiffuse": {
      value: null
    },
    "sceneDepth": {
      value: null
    },
    "tDiffuse": {
      value: null
    },
    "projMat": {
      value: new Matrix4()
    },
    "viewMat": {
      value: new Matrix4()
    },
    "projectionMatrixInv": {
      value: new Matrix4()
    },
    "viewMatrixInv": {
      value: new Matrix4()
    },
    "cameraPos": {
      value: new Vector3()
    },
    "resolution": {
      value: new Vector2()
    },
    "time": {
      value: 0
    },
    "r": {
      value: 5
    },
    "blueNoise": {
      value: null
    },
    "radius": {
      value: 12
    },
    "worldRadius": {
      value: 5
    },
    "index": {
      value: 0
    },
    "poissonDisk": {
      value: []
    },
    "distanceFalloff": {
      value: 1
    },
    "near": {
      value: 0.1
    },
    "far": {
      value: 1e3
    },
    "screenSpaceRadius": {
      value: false
    }
  },
  depthWrite: false,
  depthTest: false,
  vertexShader: (
    /* glsl */
    `
		varying vec2 vUv;
		void main() {
			vUv = uv;
			gl_Position = vec4(position, 1.0);
		}`
  ),
  fragmentShader: (
    /* glsl */
    `
		uniform sampler2D sceneDiffuse;
    uniform highp sampler2D sceneDepth;
    uniform sampler2D tDiffuse;
    uniform sampler2D blueNoise;
    uniform mat4 projectionMatrixInv;
    uniform mat4 viewMatrixInv;
    uniform vec2 resolution;
    uniform float r;
    uniform float radius;
     uniform float worldRadius;
    uniform float index;
     uniform float near;
     uniform float far;
     uniform float distanceFalloff;
     uniform bool screenSpaceRadius;
    varying vec2 vUv;

    highp float linearize_depth(highp float d, highp float zNear,highp float zFar)
    {
        highp float z_n = 2.0 * d - 1.0;
        return 2.0 * zNear * zFar / (zFar + zNear - z_n * (zFar - zNear));
    }
    highp float linearize_depth_log(highp float d, highp float nearZ,highp float farZ) {
     float depth = pow(2.0, d * log2(farZ + 1.0)) - 1.0;
     float a = farZ / (farZ - nearZ);
     float b = farZ * nearZ / (nearZ - farZ);
     float linDepth = a + b / depth;
     return linearize_depth(linDepth, nearZ, farZ);
   }
   highp float linearize_depth_ortho(highp float d, highp float nearZ, highp float farZ) {
     return nearZ + (farZ - nearZ) * d;
   }
   vec3 getWorldPosLog(vec3 posS) {
     vec2 uv = posS.xy;
     float z = posS.z;
     float nearZ =near;
     float farZ = far;
     float depth = pow(2.0, z * log2(farZ + 1.0)) - 1.0;
     float a = farZ / (farZ - nearZ);
     float b = farZ * nearZ / (nearZ - farZ);
     float linDepth = a + b / depth;
     vec4 clipVec = vec4(uv, linDepth, 1.0) * 2.0 - 1.0;
     vec4 wpos = projectionMatrixInv * clipVec;
     return wpos.xyz / wpos.w;
   }
    vec3 getWorldPos(float depth, vec2 coord) {
     #ifdef LOGDEPTH
      #ifndef ORTHO
          return getWorldPosLog(vec3(coord, depth));
      #endif
     #endif
        
        float z = depth * 2.0 - 1.0;
        vec4 clipSpacePosition = vec4(coord * 2.0 - 1.0, z, 1.0);
        vec4 viewSpacePosition = projectionMatrixInv * clipSpacePosition;
        // Perspective division
       vec4 worldSpacePosition = viewSpacePosition;
       worldSpacePosition.xyz /= worldSpacePosition.w;
        return worldSpacePosition.xyz;
    }
    #include <common>
    #define NUM_SAMPLES 16
    uniform vec2 poissonDisk[NUM_SAMPLES];
    void main() {
        const float pi = 3.14159;
        vec2 texelSize = vec2(1.0 / resolution.x, 1.0 / resolution.y);
        vec2 uv = vUv;
        vec4 data = texture2D(tDiffuse, vUv);
        float occlusion = data.r;
        float baseOcc = data.r;
        vec3 normal = data.gba * 2.0 - 1.0;
        float count = 1.0;
        float d = texture2D(sceneDepth, vUv).x;
        if (d == 1.0) {
          gl_FragColor = data;
          return;
        }
        vec3 worldPos = getWorldPos(d, vUv);
        float size = radius;
        float angle;
        if (index == 0.0) {
             angle = texture2D(blueNoise, gl_FragCoord.xy / 128.0).w * PI2;
        } else if (index == 1.0) {
             angle = texture2D(blueNoise, gl_FragCoord.xy / 128.0).z * PI2;
        } else if (index == 2.0) {
             angle = texture2D(blueNoise, gl_FragCoord.xy / 128.0).y * PI2;
        } else {
             angle = texture2D(blueNoise, gl_FragCoord.xy / 128.0).x * PI2;
        }

        mat2 rotationMatrix = mat2(cos(angle), -sin(angle), sin(angle), cos(angle));
        float radiusToUse = screenSpaceRadius ? distance(
          worldPos,
          getWorldPos(d, vUv +
            vec2(worldRadius, 0.0) / resolution)
        ) : worldRadius;
        float distanceFalloffToUse =screenSpaceRadius ?
        radiusToUse * distanceFalloff
    : radiusToUse * distanceFalloff * 0.2;

        float invDistance = (1.0 / distanceFalloffToUse);
        for(int i = 0; i < NUM_SAMPLES; i++) {
            vec2 offset = (rotationMatrix * poissonDisk[i]) * texelSize * size;
            vec4 dataSample = texture2D(tDiffuse, uv + offset);
            float occSample = dataSample.r;
            vec3 normalSample = dataSample.gba * 2.0 - 1.0;
            float dSample = texture2D(sceneDepth, uv + offset).x;
            vec3 worldPosSample = getWorldPos(dSample, uv + offset);
            float tangentPlaneDist = abs(dot(worldPosSample - worldPos, normal));
            float rangeCheck = float(dSample != 1.0) * exp(-1.0 * tangentPlaneDist * invDistance ) * max(dot(normal, normalSample), 0.0);
            occlusion += occSample * rangeCheck;
            count += rangeCheck;
        }
        if (count > 0.0) {
          occlusion /= count;
        }
        occlusion = clamp(occlusion, 0.0, 1.0);
        if (occlusion == 0.0) {
          occlusion = 1.0;
        }
        gl_FragColor = vec4(occlusion, 0.5 + 0.5 * normal);
    }
    `
  )
};
var $26aca173e0984d99$export$1efdf491687cd442 = {
  uniforms: {
    "sceneDepth": {
      value: null
    },
    "resolution": {
      value: new Vector2()
    },
    "near": {
      value: 0.1
    },
    "far": {
      value: 1e3
    },
    "viewMatrixInv": {
      value: new Matrix4()
    },
    "projectionMatrixInv": {
      value: new Matrix4()
    },
    "logDepth": {
      value: false
    },
    "ortho": {
      value: false
    }
  },
  depthWrite: false,
  depthTest: false,
  vertexShader: (
    /* glsl */
    `
    varying vec2 vUv;
    void main() {
        vUv = uv;
        gl_Position = vec4(position, 1);
    }`
  ),
  fragmentShader: (
    /* glsl */
    `
    uniform highp sampler2D sceneDepth;
    uniform vec2 resolution;
    uniform float near;
    uniform float far;
    uniform bool logDepth;
    uniform bool ortho;
    uniform mat4 viewMatrixInv;
    uniform mat4 projectionMatrixInv;
    varying vec2 vUv;
    layout(location = 1) out vec4 gNormal;
    vec3 getWorldPosLog(vec3 posS) {
        vec2 uv = posS.xy;
        float z = posS.z;
        float nearZ =near;
        float farZ = far;
        float depth = pow(2.0, z * log2(farZ + 1.0)) - 1.0;
        float a = farZ / (farZ - nearZ);
        float b = farZ * nearZ / (nearZ - farZ);
        float linDepth = a + b / depth;
        vec4 clipVec = vec4(uv, linDepth, 1.0) * 2.0 - 1.0;
        vec4 wpos = projectionMatrixInv * clipVec;
        return wpos.xyz / wpos.w;
      }
      vec3 getWorldPos(float depth, vec2 coord) {
        if (logDepth && !ortho) {
          return getWorldPosLog(vec3(coord, depth));
        }
        float z = depth * 2.0 - 1.0;
        vec4 clipSpacePosition = vec4(coord * 2.0 - 1.0, z, 1.0);
        vec4 viewSpacePosition = projectionMatrixInv * clipSpacePosition;
        // Perspective division
       vec4 worldSpacePosition = viewSpacePosition;
       worldSpacePosition.xyz /= worldSpacePosition.w;
        return worldSpacePosition.xyz;
    }
  
    vec3 computeNormal(vec3 worldPos, vec2 vUv) {
      ivec2 p = ivec2(vUv * resolution);
      #ifdef REVERSEDEPTH
      float c0 = 1.0 - texelFetch(sceneDepth, p, 0).x;
      float l2 = 1.0 - texelFetch(sceneDepth, p - ivec2(2, 0), 0).x;
      float l1 = 1.0 - texelFetch(sceneDepth, p - ivec2(1, 0), 0).x;
      float r1 = 1.0 - texelFetch(sceneDepth, p + ivec2(1, 0), 0).x;
      float r2 = 1.0 - texelFetch(sceneDepth, p + ivec2(2, 0), 0).x;
      float b2 = 1.0 - texelFetch(sceneDepth, p - ivec2(0, 2), 0).x;
      float b1 = 1.0 - texelFetch(sceneDepth, p - ivec2(0, 1), 0).x;
      float t1 = 1.0 - texelFetch(sceneDepth, p + ivec2(0, 1), 0).x;
      float t2 = 1.0 - texelFetch(sceneDepth, p + ivec2(0, 2), 0).x;
      #else
      float c0 = texelFetch(sceneDepth, p, 0).x;
      float l2 = texelFetch(sceneDepth, p - ivec2(2, 0), 0).x;
      float l1 = texelFetch(sceneDepth, p - ivec2(1, 0), 0).x;
      float r1 = texelFetch(sceneDepth, p + ivec2(1, 0), 0).x;
      float r2 = texelFetch(sceneDepth, p + ivec2(2, 0), 0).x;
      float b2 = texelFetch(sceneDepth, p - ivec2(0, 2), 0).x;
      float b1 = texelFetch(sceneDepth, p - ivec2(0, 1), 0).x;
      float t1 = texelFetch(sceneDepth, p + ivec2(0, 1), 0).x;
      float t2 = texelFetch(sceneDepth, p + ivec2(0, 2), 0).x;
      #endif
  
      float dl = abs((2.0 * l1 - l2) - c0);
      float dr = abs((2.0 * r1 - r2) - c0);
      float db = abs((2.0 * b1 - b2) - c0);
      float dt = abs((2.0 * t1 - t2) - c0);
  
      vec3 ce = getWorldPos(c0, vUv).xyz;
  
      vec3 dpdx = (dl < dr) ? ce - getWorldPos(l1, (vUv - vec2(1.0 / resolution.x, 0.0))).xyz
                            : -ce + getWorldPos(r1, (vUv + vec2(1.0 / resolution.x, 0.0))).xyz;
      vec3 dpdy = (db < dt) ? ce - getWorldPos(b1, (vUv - vec2(0.0, 1.0 / resolution.y))).xyz
                            : -ce + getWorldPos(t1, (vUv + vec2(0.0, 1.0 / resolution.y))).xyz;
  
      return normalize(cross(dpdx, dpdy));
  }
    void main() {
        vec2 uv = vUv - vec2(0.5) / resolution;
        vec2 pixelSize = vec2(1.0) / resolution;
        highp vec2[4] uvSamples;
        uvSamples[0] = uv;
        uvSamples[1] = uv + vec2(pixelSize.x, 0.0);
        uvSamples[2] = uv + vec2(0.0, pixelSize.y);
        uvSamples[3] = uv + pixelSize;
        #ifdef REVERSEDEPTH
        float depth00 = 1.0 - texture2D(sceneDepth, uvSamples[0]).r;
        float depth10 = 1.0 - texture2D(sceneDepth, uvSamples[1]).r;
        float depth01 = 1.0 - texture2D(sceneDepth, uvSamples[2]).r;
        float depth11 = 1.0 - texture2D(sceneDepth, uvSamples[3]).r;
        #else
        float depth00 = texture2D(sceneDepth, uvSamples[0]).r;
        float depth10 = texture2D(sceneDepth, uvSamples[1]).r;
        float depth01 = texture2D(sceneDepth, uvSamples[2]).r;
        float depth11 = texture2D(sceneDepth, uvSamples[3]).r;
        #endif
        float minDepth = min(min(depth00, depth10), min(depth01, depth11));
        float maxDepth = max(max(depth00, depth10), max(depth01, depth11));
        float targetDepth = minDepth;
        // Checkerboard pattern to avoid artifacts
        if (mod(gl_FragCoord.x + gl_FragCoord.y, 2.0) > 0.5) { 
            targetDepth = maxDepth;
        }
        int chosenIndex = 0;
        float[4] samples;
        samples[0] = depth00;
        samples[1] = depth10;
        samples[2] = depth01;
        samples[3] = depth11;
        for(int i = 0; i < 4; ++i) {
            if (samples[i] == targetDepth) {
                chosenIndex = i;
                break;
            }
        }
        gl_FragColor = vec4(samples[chosenIndex], 0.0, 0.0, 1.0);
        gNormal = vec4(computeNormal(
            getWorldPos(samples[chosenIndex], uvSamples[chosenIndex]), uvSamples[chosenIndex]
        ), 0.0);
    }`
  )
};
var $06269ad78f3c5fdf$var$BlueNoise = `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`;
var $06269ad78f3c5fdf$var$bluenoiseBits = (() => Uint8Array.from(atob($06269ad78f3c5fdf$var$BlueNoise), (c2) => c2.charCodeAt(0)))();
var $06269ad78f3c5fdf$export$2e2bcd8739ae039 = $06269ad78f3c5fdf$var$bluenoiseBits;
var $ff9437d9c7577f11$var$version = (() => parseInt(REVISION.replace(/\D+/g, "")))();
var $ff9437d9c7577f11$export$156f6a58f569aa09 = $ff9437d9c7577f11$var$version >= 162 ? class extends WebGLRenderTarget {
  constructor(width = 1, height = 1, count = 1, options = {}) {
    super(width, height, {
      ...options,
      count
    });
    this.isWebGLMultipleRenderTargets = true;
  }
  get texture() {
    return this.textures;
  }
} : class extends WebGLRenderTarget {
  constructor(width = 1, height = 1, count = 1, options = {}) {
    super(width, height, options);
    this.isWebGLMultipleRenderTargets = true;
    const texture = this.texture;
    this.texture = [];
    for (let i = 0; i < count; i++) {
      this.texture[i] = texture.clone();
      this.texture[i].isRenderTargetTexture = true;
    }
  }
  setSize(width, height, depth = 1) {
    if (this.width !== width || this.height !== height || this.depth !== depth) {
      this.width = width;
      this.height = height;
      this.depth = depth;
      for (let i = 0, il = this.texture.length; i < il; i++) {
        this.texture[i].image.width = width;
        this.texture[i].image.height = height;
        this.texture[i].image.depth = depth;
      }
      this.dispose();
    }
    this.viewport.set(0, 0, width, height);
    this.scissor.set(0, 0, width, height);
  }
  copy(source) {
    this.dispose();
    this.width = source.width;
    this.height = source.height;
    this.depth = source.depth;
    this.scissor.copy(source.scissor);
    this.scissorTest = source.scissorTest;
    this.viewport.copy(source.viewport);
    this.depthBuffer = source.depthBuffer;
    this.stencilBuffer = source.stencilBuffer;
    if (source.depthTexture !== null) this.depthTexture = source.depthTexture.clone();
    this.texture.length = 0;
    for (let i = 0, il = source.texture.length; i < il; i++) {
      this.texture[i] = source.texture[i].clone();
      this.texture[i].isRenderTargetTexture = true;
    }
    return this;
  }
};
function $87431ee93b037844$var$checkTimerQuery(timerQuery, gl, pass) {
  const available = gl.getQueryParameter(timerQuery, gl.QUERY_RESULT_AVAILABLE);
  if (available) {
    const elapsedTimeInNs = gl.getQueryParameter(timerQuery, gl.QUERY_RESULT);
    const elapsedTimeInMs = elapsedTimeInNs / 1e6;
    pass.lastTime = pass.lastTime === 0 ? elapsedTimeInMs : pass.timeRollingAverage * pass.lastTime + (1 - pass.timeRollingAverage) * elapsedTimeInMs;
  } else
    setTimeout(() => {
      $87431ee93b037844$var$checkTimerQuery(timerQuery, gl, pass);
    }, 1);
}
var $87431ee93b037844$export$2489f9981ab0fa82 = class extends (0, Pass) {
  /**
   * 
   * @param {THREE.Scene} scene
   * @param {THREE.Camera} camera 
   * @param {number} width 
   * @param {number} height
   *  
   * @property {THREE.Scene} scene
   * @property {THREE.Camera} camera
   * @property {number} width
   * @property {number} height
   */
  constructor(scene, camera, width = 512, height = 512) {
    super();
    this.width = width;
    this.height = height;
    this.clear = true;
    this.camera = camera;
    this.scene = scene;
    this.autosetGamma = true;
    this.configuration = new Proxy({
      aoSamples: 16,
      aoRadius: 5,
      aoTones: 0,
      denoiseSamples: 8,
      denoiseRadius: 12,
      distanceFalloff: 1,
      intensity: 5,
      denoiseIterations: 2,
      renderMode: 0,
      biasOffset: 0,
      biasMultiplier: 0,
      color: new Color(0, 0, 0),
      gammaCorrection: true,
      depthBufferType: (0, $05f6997e4b65da14$export$ed4ee5d1e55474a5).Default,
      screenSpaceRadius: false,
      halfRes: false,
      depthAwareUpsampling: true,
      colorMultiply: true,
      transparencyAware: false,
      accumulate: false
    }, {
      set: (target, propName, value) => {
        const oldProp = target[propName];
        target[propName] = value;
        if (value.equals) {
          if (!value.equals(oldProp)) this.firstFrame();
        } else if (oldProp !== value) this.firstFrame();
        if (propName === "aoSamples" && oldProp !== value) this.configureAOPass(this.configuration.depthBufferType, this.camera.isOrthographicCamera);
        if (propName === "denoiseSamples" && oldProp !== value) this.configureDenoisePass(this.configuration.depthBufferType, this.camera.isOrthographicCamera);
        if (propName === "halfRes" && oldProp !== value) {
          this.configureAOPass(this.configuration.depthBufferType, this.camera.isOrthographicCamera);
          this.configureHalfResTargets();
          this.configureEffectCompositer(this.configuration.depthBufferType, this.camera.isOrthographicCamera);
          this.setSize(this.width, this.height);
        }
        if (propName === "depthAwareUpsampling" && oldProp !== value) this.configureEffectCompositer(this.configuration.depthBufferType, this.camera.isOrthographicCamera);
        if (propName === "gammaCorrection") this.autosetGamma = false;
        if (propName === "transparencyAware" && oldProp !== value) {
          this.autoDetectTransparency = false;
          this.configureTransparencyTarget();
        }
        return true;
      }
    });
    this.samples = [];
    this.samplesDenoise = [];
    this.autoDetectTransparency = true;
    this.frames = 0;
    this.lastViewMatrix = new Matrix4();
    this.lastProjectionMatrix = new Matrix4();
    this.configureEffectCompositer(this.configuration.depthBufferType);
    this.configureSampleDependentPasses();
    this.configureHalfResTargets();
    this.detectTransparency();
    this.configureTransparencyTarget();
    this.copyQuad = new (0, $e4ca8dcb0218f846$export$dcd670d73db751f5)(new ShaderMaterial({
      uniforms: {
        tDiffuse: {
          value: null
        }
      },
      depthWrite: false,
      vertexShader: `
            varying vec2 vUv;
            void main() {
                vUv = uv;
                gl_Position = vec4(position, 1);
            }
            `,
      fragmentShader: `
            uniform sampler2D tDiffuse;
            varying vec2 vUv;
            void main() {
                gl_FragColor = texture2D(tDiffuse, vUv);
            }
            `
    }));
    this.writeTargetInternal = new WebGLRenderTarget(this.width, this.height, {
      minFilter: LinearFilter,
      magFilter: LinearFilter,
      depthBuffer: false,
      format: RGBAFormat
    });
    this.readTargetInternal = new WebGLRenderTarget(this.width, this.height, {
      minFilter: LinearFilter,
      magFilter: LinearFilter,
      depthBuffer: false,
      format: RGBAFormat
    });
    this.outputTargetInternal = new WebGLRenderTarget(this.width, this.height, {
      minFilter: LinearFilter,
      magFilter: LinearFilter,
      depthBuffer: false
    });
    this.accumulationRenderTarget = new WebGLRenderTarget(this.width, this.height, {
      minFilter: LinearFilter,
      magFilter: LinearFilter,
      depthBuffer: false,
      format: RGBAFormat,
      type: HalfFloatType,
      stencilBuffer: false,
      depthBuffer: false,
      alpha: true
    });
    this.accumulationQuad = new (0, $e4ca8dcb0218f846$export$dcd670d73db751f5)(new ShaderMaterial({
      uniforms: {
        frame: {
          value: 0
        },
        tDiffuse: {
          value: null
        }
      },
      transparent: true,
      opacity: 1,
      vertexShader: `
             varying vec2 vUv;
             void main() {
                 vUv = uv;
                 gl_Position = vec4(position, 1);
             }`,
      fragmentShader: `
             uniform sampler2D tDiffuse;
             uniform float frame;
                varying vec2 vUv;
                void main() {
                    vec4 color = texture2D(tDiffuse, vUv);
                    gl_FragColor = vec4(color.rgb, 1.0 / (frame + 1.0));
                }
                `
    }));
    this.bluenoise = new DataTexture((0, $06269ad78f3c5fdf$export$2e2bcd8739ae039), 128, 128);
    this.bluenoise.colorSpace = NoColorSpace;
    this.bluenoise.wrapS = RepeatWrapping;
    this.bluenoise.wrapT = RepeatWrapping;
    this.bluenoise.minFilter = NearestFilter;
    this.bluenoise.magFilter = NearestFilter;
    this.bluenoise.needsUpdate = true;
    this.lastTime = 0;
    this.timeRollingAverage = 0.99;
    this.needsDepthTexture = true;
    this.needsSwap = true;
    this._r = new Vector2();
    this._c = new Color();
  }
  configureHalfResTargets() {
    this.firstFrame();
    if (this.configuration.halfRes) {
      this.depthDownsampleTarget = new (0, $ff9437d9c7577f11$export$156f6a58f569aa09)(this.width / 2, this.height / 2, 2);
      if (REVISION <= 161) this.depthDownsampleTarget.textures = this.depthDownsampleTarget.texture;
      this.depthDownsampleTarget.textures[0].format = RedFormat;
      this.depthDownsampleTarget.textures[0].type = FloatType;
      this.depthDownsampleTarget.textures[0].minFilter = NearestFilter;
      this.depthDownsampleTarget.textures[0].magFilter = NearestFilter;
      this.depthDownsampleTarget.textures[0].depthBuffer = false;
      this.depthDownsampleTarget.textures[1].format = RGBAFormat;
      this.depthDownsampleTarget.textures[1].type = HalfFloatType;
      this.depthDownsampleTarget.textures[1].minFilter = NearestFilter;
      this.depthDownsampleTarget.textures[1].magFilter = NearestFilter;
      this.depthDownsampleTarget.textures[1].depthBuffer = false;
      this.depthDownsampleQuad = new (0, $e4ca8dcb0218f846$export$dcd670d73db751f5)(new ShaderMaterial((0, $26aca173e0984d99$export$1efdf491687cd442)));
    } else {
      if (this.depthDownsampleTarget) {
        this.depthDownsampleTarget.dispose();
        this.depthDownsampleTarget = null;
      }
      if (this.depthDownsampleQuad) {
        this.depthDownsampleQuad.dispose();
        this.depthDownsampleQuad = null;
      }
    }
  }
  detectTransparency() {
    if (this.autoDetectTransparency) {
      let isTransparency = false;
      this.scene.traverse((obj) => {
        if (obj.material && obj.material.transparent) isTransparency = true;
      });
      if (isTransparency) this.configuration.transparencyAware = true;
    }
  }
  configureTransparencyTarget() {
    if (this.configuration.transparencyAware) {
      this.transparencyRenderTargetDWFalse = new WebGLRenderTarget(this.width, this.height, {
        minFilter: LinearFilter,
        magFilter: NearestFilter,
        type: HalfFloatType,
        format: RGBAFormat
      });
      this.transparencyRenderTargetDWTrue = new WebGLRenderTarget(this.width, this.height, {
        minFilter: LinearFilter,
        magFilter: NearestFilter,
        type: HalfFloatType,
        format: RGBAFormat
      });
      this.transparencyRenderTargetDWTrue.depthTexture = new DepthTexture(this.width, this.height, UnsignedIntType);
      this.depthCopyPass = new (0, $e4ca8dcb0218f846$export$dcd670d73db751f5)(new ShaderMaterial({
        uniforms: {
          depthTexture: {
            value: this.depthTexture
          },
          reverseDepthBuffer: {
            value: this.configuration.depthBufferType === (0, $05f6997e4b65da14$export$ed4ee5d1e55474a5).Reverse
          }
        },
        vertexShader: (
          /* glsl */
          `
            varying vec2 vUv;
            void main() {
                vUv = uv;
                gl_Position = vec4(position, 1);
            }`
        ),
        fragmentShader: (
          /* glsl */
          `
            uniform sampler2D depthTexture;
            uniform bool reverseDepthBuffer;
            varying vec2 vUv;
            void main() {
                if (reverseDepthBuffer) {
               float d = 1.0 - texture2D(depthTexture, vUv).r;
           
               d += 0.00001;
               gl_FragDepth = 1.0 - d;
            } else {
                float d = texture2D(depthTexture, vUv).r;
                d += 0.00001;
                gl_FragDepth = d;
            }
               gl_FragColor = vec4(0.0, 0.0, 0.0, 0.0);
            }
            `
        )
      }));
    } else {
      if (this.transparencyRenderTargetDWFalse) {
        this.transparencyRenderTargetDWFalse.dispose();
        this.transparencyRenderTargetDWFalse = null;
      }
      if (this.transparencyRenderTargetDWTrue) {
        this.transparencyRenderTargetDWTrue.dispose();
        this.transparencyRenderTargetDWTrue = null;
      }
      if (this.depthCopyPass) {
        this.depthCopyPass.dispose();
        this.depthCopyPass = null;
      }
    }
  }
  renderTransparency(renderer) {
    const oldBackground = this.scene.background;
    const oldClearColor = renderer.getClearColor(new Color());
    const oldClearAlpha = renderer.getClearAlpha();
    const oldVisibility = /* @__PURE__ */ new Map();
    const oldAutoClearDepth = renderer.autoClearDepth;
    this.scene.traverse((obj) => {
      oldVisibility.set(obj, obj.visible);
    });
    this.scene.background = null;
    renderer.autoClearDepth = false;
    renderer.setClearColor(new Color(0, 0, 0), 0);
    this.depthCopyPass.material.uniforms.depthTexture.value = this.depthTexture;
    this.depthCopyPass.material.uniforms.reverseDepthBuffer.value = this.configuration.depthBufferType === (0, $05f6997e4b65da14$export$ed4ee5d1e55474a5).Reverse;
    renderer.setRenderTarget(this.transparencyRenderTargetDWFalse);
    this.scene.traverse((obj) => {
      if (obj.material) obj.visible = oldVisibility.get(obj) && (obj.material.transparent && !obj.material.depthWrite && !obj.userData.treatAsOpaque || !!obj.userData.cannotReceiveAO);
    });
    renderer.clear(true, true, true);
    this.depthCopyPass.render(renderer);
    renderer.render(this.scene, this.camera);
    renderer.setRenderTarget(this.transparencyRenderTargetDWTrue);
    this.scene.traverse((obj) => {
      if (obj.material) obj.visible = oldVisibility.get(obj) && obj.material.transparent && obj.material.depthWrite && !obj.userData.treatAsOpaque;
    });
    renderer.clear(true, true, true);
    this.depthCopyPass.render(renderer);
    renderer.render(this.scene, this.camera);
    this.scene.traverse((obj) => {
      obj.visible = oldVisibility.get(obj);
    });
    renderer.setClearColor(oldClearColor, oldClearAlpha);
    this.scene.background = oldBackground;
    renderer.autoClearDepth = oldAutoClearDepth;
  }
  configureSampleDependentPasses() {
    this.configureAOPass(this.configuration.depthBufferType, this.camera.isOrthographicCamera);
    this.configureDenoisePass(this.configuration.depthBufferType, this.camera.isOrthographicCamera);
  }
  configureAOPass(depthBufferType = (0, $05f6997e4b65da14$export$ed4ee5d1e55474a5).Default, ortho = false) {
    this.firstFrame();
    this.samples = this.generateHemisphereSamples(this.configuration.aoSamples);
    const e = {
      ...(0, $1ed45968c1160c3c$export$c9b263b9a17dffd7)
    };
    e.fragmentShader = e.fragmentShader.replace("16", this.configuration.aoSamples).replace("16.0", this.configuration.aoSamples + ".0");
    if (depthBufferType === (0, $05f6997e4b65da14$export$ed4ee5d1e55474a5).Log) e.fragmentShader = "#define LOGDEPTH\n" + e.fragmentShader;
    else if (depthBufferType === (0, $05f6997e4b65da14$export$ed4ee5d1e55474a5).Reverse) e.fragmentShader = "#define REVERSEDEPTH\n" + e.fragmentShader;
    if (ortho) e.fragmentShader = "#define ORTHO\n" + e.fragmentShader;
    if (this.configuration.halfRes) e.fragmentShader = "#define HALFRES\n" + e.fragmentShader;
    if (this.effectShaderQuad) {
      this.effectShaderQuad.material.dispose();
      this.effectShaderQuad.material = new ShaderMaterial(e);
    } else this.effectShaderQuad = new (0, $e4ca8dcb0218f846$export$dcd670d73db751f5)(new ShaderMaterial(e));
  }
  configureDenoisePass(depthBufferType = (0, $05f6997e4b65da14$export$ed4ee5d1e55474a5).Default, ortho = false) {
    this.firstFrame();
    this.samplesDenoise = this.generateDenoiseSamples(this.configuration.denoiseSamples, 11);
    const p2 = {
      ...(0, $e52378cd0f5a973d$export$57856b59f317262e)
    };
    p2.fragmentShader = p2.fragmentShader.replace("16", this.configuration.denoiseSamples);
    if (depthBufferType === (0, $05f6997e4b65da14$export$ed4ee5d1e55474a5).Log) p2.fragmentShader = "#define LOGDEPTH\n" + p2.fragmentShader;
    else if (depthBufferType === (0, $05f6997e4b65da14$export$ed4ee5d1e55474a5).Reverse) p2.fragmentShader = "#define REVERSEDEPTH\n" + p2.fragmentShader;
    if (ortho) p2.fragmentShader = "#define ORTHO\n" + p2.fragmentShader;
    if (this.poissonBlurQuad) {
      this.poissonBlurQuad.material.dispose();
      this.poissonBlurQuad.material = new ShaderMaterial(p2);
    } else this.poissonBlurQuad = new (0, $e4ca8dcb0218f846$export$dcd670d73db751f5)(new ShaderMaterial(p2));
  }
  configureEffectCompositer(depthBufferType = (0, $05f6997e4b65da14$export$ed4ee5d1e55474a5).Default, ortho = false) {
    this.firstFrame();
    const e = {
      ...(0, $12b21d24d1192a04$export$a815acccbd2c9a49)
    };
    if (depthBufferType === (0, $05f6997e4b65da14$export$ed4ee5d1e55474a5).Log) e.fragmentShader = "#define LOGDEPTH\n" + e.fragmentShader;
    else if (depthBufferType === (0, $05f6997e4b65da14$export$ed4ee5d1e55474a5).Reverse) e.fragmentShader = "#define REVERSEDEPTH\n" + e.fragmentShader;
    if (ortho) e.fragmentShader = "#define ORTHO\n" + e.fragmentShader;
    if (this.configuration.halfRes && this.configuration.depthAwareUpsampling) e.fragmentShader = "#define HALFRES\n" + e.fragmentShader;
    if (this.effectCompositerQuad) {
      this.effectCompositerQuad.material.dispose();
      this.effectCompositerQuad.material = new ShaderMaterial(e);
    } else this.effectCompositerQuad = new (0, $e4ca8dcb0218f846$export$dcd670d73db751f5)(new ShaderMaterial(e));
  }
  /**
       * 
       * @param {Number} n 
       * @returns {THREE.Vector3[]}
       */
  generateHemisphereSamples(n) {
    const points = [];
    for (let k2 = 0; k2 < n; k2++) {
      const theta = 2.399963 * k2;
      const r = Math.sqrt(k2 + 0.5) / Math.sqrt(n);
      const x = r * Math.cos(theta);
      const y = r * Math.sin(theta);
      const z2 = Math.sqrt(1 - (x * x + y * y));
      points.push(new Vector3(x, y, z2));
    }
    return points;
  }
  /**
       * 
       * @param {number} numSamples 
       * @param {number} numRings 
       * @returns {THREE.Vector2[]}
       */
  generateDenoiseSamples(numSamples, numRings) {
    const angleStep = 2 * Math.PI * numRings / numSamples;
    const invNumSamples = 1 / numSamples;
    const radiusStep = invNumSamples;
    const samples = [];
    let radius = invNumSamples;
    let angle = 0;
    for (let i = 0; i < numSamples; i++) {
      samples.push(new Vector2(Math.cos(angle), Math.sin(angle)).multiplyScalar(Math.pow(radius, 0.75)));
      radius += radiusStep;
      angle += angleStep;
    }
    return samples;
  }
  setSize(width, height) {
    this.firstFrame();
    this.width = width;
    this.height = height;
    const c2 = this.configuration.halfRes ? 0.5 : 1;
    this.writeTargetInternal.setSize(width * c2, height * c2);
    this.readTargetInternal.setSize(width * c2, height * c2);
    this.accumulationRenderTarget.setSize(width * c2, height * c2);
    if (this.configuration.halfRes) this.depthDownsampleTarget.setSize(width * c2, height * c2);
    if (this.configuration.transparencyAware) {
      this.transparencyRenderTargetDWFalse.setSize(width, height);
      this.transparencyRenderTargetDWTrue.setSize(width, height);
    }
    this.outputTargetInternal.setSize(width, height);
  }
  setDepthTexture(depthTexture) {
    this.depthTexture = depthTexture;
  }
  firstFrame() {
    this.needsFrame = true;
  }
  render(renderer, inputBuffer, outputBuffer) {
    const xrEnabled = renderer.xr.enabled;
    renderer.xr.enabled = false;
    if (renderer.capabilities.logarithmicDepthBuffer && this.configuration.depthBufferType !== (0, $05f6997e4b65da14$export$ed4ee5d1e55474a5).Log || renderer.capabilities.reverseDepthBuffer && this.configuration.depthBufferType !== (0, $05f6997e4b65da14$export$ed4ee5d1e55474a5).Reverse) {
      this.configuration.depthBufferType = renderer.capabilities.logarithmicDepthBuffer ? (0, $05f6997e4b65da14$export$ed4ee5d1e55474a5).Log : renderer.capabilities.reverseDepthBuffer ? (0, $05f6997e4b65da14$export$ed4ee5d1e55474a5).Reverse : (0, $05f6997e4b65da14$export$ed4ee5d1e55474a5).Default;
      this.configureAOPass(this.configuration.depthBufferType, this.camera.isOrthographicCamera);
      this.configureDenoisePass(this.configuration.depthBufferType, this.camera.isOrthographicCamera);
      this.configureEffectCompositer(this.configuration.depthBufferType, this.camera.isOrthographicCamera);
    }
    this.detectTransparency();
    if (inputBuffer.texture.type !== this.outputTargetInternal.texture.type || inputBuffer.texture.format !== this.outputTargetInternal.texture.format) {
      this.outputTargetInternal.texture.type = inputBuffer.texture.type;
      this.outputTargetInternal.texture.format = inputBuffer.texture.format;
      this.outputTargetInternal.texture.needsUpdate = true;
    }
    this.camera.updateMatrixWorld();
    if (this.lastViewMatrix.equals(this.camera.matrixWorldInverse) && this.lastProjectionMatrix.equals(this.camera.projectionMatrix) && this.configuration.accumulate && !this.needsFrame) this.frame++;
    else {
      if (this.configuration.accumulate) {
        renderer.setRenderTarget(this.accumulationRenderTarget);
        renderer.clear(true, true, true);
      }
      this.frame = 0;
      this.needsFrame = false;
    }
    this.lastViewMatrix.copy(this.camera.matrixWorldInverse);
    this.lastProjectionMatrix.copy(this.camera.projectionMatrix);
    let gl;
    let ext;
    let timerQuery;
    if (this.debugMode) {
      gl = renderer.getContext();
      ext = gl.getExtension("EXT_disjoint_timer_query_webgl2");
      if (ext === null) {
        console.error("EXT_disjoint_timer_query_webgl2 not available, disabling debug mode.");
        this.debugMode = false;
      }
    }
    if (this.debugMode) {
      timerQuery = gl.createQuery();
      gl.beginQuery(ext.TIME_ELAPSED_EXT, timerQuery);
    }
    if (this.configuration.transparencyAware) this.renderTransparency(renderer);
    this._r.set(this.width, this.height);
    let trueRadius = this.configuration.aoRadius;
    if (this.configuration.halfRes && this.configuration.screenSpaceRadius) trueRadius *= 0.5;
    if (this.frame < 1024 / this.configuration.aoSamples) {
      if (this.configuration.halfRes) {
        renderer.setRenderTarget(this.depthDownsampleTarget);
        this.depthDownsampleQuad.material.uniforms.sceneDepth.value = this.depthTexture;
        this.depthDownsampleQuad.material.uniforms.resolution.value = this._r;
        this.depthDownsampleQuad.material.uniforms["near"].value = this.camera.near;
        this.depthDownsampleQuad.material.uniforms["far"].value = this.camera.far;
        this.depthDownsampleQuad.material.uniforms["projectionMatrixInv"].value = this.camera.projectionMatrixInverse;
        this.depthDownsampleQuad.material.uniforms["viewMatrixInv"].value = this.camera.matrixWorld;
        this.depthDownsampleQuad.material.uniforms["logDepth"].value = this.configuration.logarithmicDepthBuffer;
        this.depthDownsampleQuad.material.uniforms["ortho"].value = this.camera.isOrthographicCamera;
        this.depthDownsampleQuad.render(renderer);
      }
      this.effectShaderQuad.material.uniforms["sceneDiffuse"].value = inputBuffer.texture;
      this.effectShaderQuad.material.uniforms["sceneDepth"].value = this.configuration.halfRes ? this.depthDownsampleTarget.textures[0] : this.depthTexture;
      this.effectShaderQuad.material.uniforms["sceneNormal"].value = this.configuration.halfRes ? this.depthDownsampleTarget.textures[1] : null;
      this.effectShaderQuad.material.uniforms["projMat"].value = this.camera.projectionMatrix;
      this.effectShaderQuad.material.uniforms["viewMat"].value = this.camera.matrixWorldInverse;
      this.effectShaderQuad.material.uniforms["projViewMat"].value = this.camera.projectionMatrix.clone().multiply(this.camera.matrixWorldInverse.clone());
      this.effectShaderQuad.material.uniforms["projectionMatrixInv"].value = this.camera.projectionMatrixInverse;
      this.effectShaderQuad.material.uniforms["viewMatrixInv"].value = this.camera.matrixWorld;
      this.effectShaderQuad.material.uniforms["cameraPos"].value = this.camera.getWorldPosition(new Vector3());
      this.effectShaderQuad.material.uniforms["biasAdjustment"].value = new Vector2(this.configuration.biasOffset, this.configuration.biasMultiplier);
      this.effectShaderQuad.material.uniforms["resolution"].value = this.configuration.halfRes ? this._r.clone().multiplyScalar(0.5).floor() : this._r;
      this.effectShaderQuad.material.uniforms["time"].value = performance.now() / 1e3;
      this.effectShaderQuad.material.uniforms["samples"].value = this.samples;
      this.effectShaderQuad.material.uniforms["bluenoise"].value = this.bluenoise;
      this.effectShaderQuad.material.uniforms["radius"].value = trueRadius;
      this.effectShaderQuad.material.uniforms["distanceFalloff"].value = this.configuration.distanceFalloff;
      this.effectShaderQuad.material.uniforms["near"].value = this.camera.near;
      this.effectShaderQuad.material.uniforms["far"].value = this.camera.far;
      this.effectShaderQuad.material.uniforms["ortho"].value = this.camera.isOrthographicCamera;
      this.effectShaderQuad.material.uniforms["screenSpaceRadius"].value = this.configuration.screenSpaceRadius;
      this.effectShaderQuad.material.uniforms["frame"].value = this.frame;
      renderer.setRenderTarget(this.writeTargetInternal);
      this.effectShaderQuad.render(renderer);
      for (let i = 0; i < this.configuration.denoiseIterations; i++) {
        [this.writeTargetInternal, this.readTargetInternal] = [
          this.readTargetInternal,
          this.writeTargetInternal
        ];
        this.poissonBlurQuad.material.uniforms["tDiffuse"].value = this.readTargetInternal.texture;
        this.poissonBlurQuad.material.uniforms["sceneDepth"].value = this.configuration.halfRes ? this.depthDownsampleTarget.textures[0] : this.depthTexture;
        this.poissonBlurQuad.material.uniforms["projMat"].value = this.camera.projectionMatrix;
        this.poissonBlurQuad.material.uniforms["viewMat"].value = this.camera.matrixWorldInverse;
        this.poissonBlurQuad.material.uniforms["projectionMatrixInv"].value = this.camera.projectionMatrixInverse;
        this.poissonBlurQuad.material.uniforms["viewMatrixInv"].value = this.camera.matrixWorld;
        this.poissonBlurQuad.material.uniforms["cameraPos"].value = this.camera.getWorldPosition(new Vector3());
        this.poissonBlurQuad.material.uniforms["resolution"].value = this.configuration.halfRes ? this._r.clone().multiplyScalar(0.5).floor() : this._r;
        this.poissonBlurQuad.material.uniforms["time"].value = performance.now() / 1e3;
        this.poissonBlurQuad.material.uniforms["blueNoise"].value = this.bluenoise;
        this.poissonBlurQuad.material.uniforms["radius"].value = this.configuration.denoiseRadius * (this.configuration.halfRes ? 0.5 : 1);
        this.poissonBlurQuad.material.uniforms["worldRadius"].value = trueRadius;
        this.poissonBlurQuad.material.uniforms["distanceFalloff"].value = this.configuration.distanceFalloff;
        this.poissonBlurQuad.material.uniforms["index"].value = i;
        this.poissonBlurQuad.material.uniforms["poissonDisk"].value = this.samplesDenoise;
        this.poissonBlurQuad.material.uniforms["near"].value = this.camera.near;
        this.poissonBlurQuad.material.uniforms["far"].value = this.camera.far;
        this.poissonBlurQuad.material.uniforms["screenSpaceRadius"].value = this.configuration.screenSpaceRadius;
        renderer.setRenderTarget(this.writeTargetInternal);
        this.poissonBlurQuad.render(renderer);
      }
      renderer.setRenderTarget(this.accumulationRenderTarget);
      const oldAutoClear = renderer.autoClear;
      renderer.autoClear = false;
      this.accumulationQuad.material.uniforms["tDiffuse"].value = this.writeTargetInternal.texture;
      this.accumulationQuad.material.uniforms["frame"].value = this.frame;
      this.accumulationQuad.render(renderer);
      renderer.autoClear = oldAutoClear;
    }
    if (this.configuration.transparencyAware) {
      this.effectCompositerQuad.material.uniforms["transparencyDWFalse"].value = this.transparencyRenderTargetDWFalse.texture;
      this.effectCompositerQuad.material.uniforms["transparencyDWTrue"].value = this.transparencyRenderTargetDWTrue.texture;
      this.effectCompositerQuad.material.uniforms["transparencyDWTrueDepth"].value = this.transparencyRenderTargetDWTrue.depthTexture;
      this.effectCompositerQuad.material.uniforms["transparencyAware"].value = true;
    }
    this.effectCompositerQuad.material.uniforms["sceneDiffuse"].value = inputBuffer.texture;
    this.effectCompositerQuad.material.uniforms["sceneDepth"].value = this.depthTexture;
    this.effectCompositerQuad.material.uniforms["aoTones"].value = this.configuration.aoTones;
    this.effectCompositerQuad.material.uniforms["near"].value = this.camera.near;
    this.effectCompositerQuad.material.uniforms["far"].value = this.camera.far;
    this.effectCompositerQuad.material.uniforms["projectionMatrixInv"].value = this.camera.projectionMatrixInverse;
    this.effectCompositerQuad.material.uniforms["viewMatrixInv"].value = this.camera.matrixWorld;
    this.effectCompositerQuad.material.uniforms["ortho"].value = this.camera.isOrthographicCamera;
    this.effectCompositerQuad.material.uniforms["downsampledDepth"].value = this.configuration.halfRes ? this.depthDownsampleTarget.textures[0] : this.depthTexture;
    this.effectCompositerQuad.material.uniforms["resolution"].value = this._r;
    this.effectCompositerQuad.material.uniforms["blueNoise"].value = this.bluenoise;
    this.effectCompositerQuad.material.uniforms["intensity"].value = this.configuration.intensity;
    this.effectCompositerQuad.material.uniforms["renderMode"].value = this.configuration.renderMode;
    this.effectCompositerQuad.material.uniforms["screenSpaceRadius"].value = this.configuration.screenSpaceRadius;
    this.effectCompositerQuad.material.uniforms["radius"].value = trueRadius;
    this.effectCompositerQuad.material.uniforms["distanceFalloff"].value = this.configuration.distanceFalloff;
    this.effectCompositerQuad.material.uniforms["gammaCorrection"].value = this.autosetGamma ? this.renderToScreen : this.configuration.gammaCorrection;
    this.effectCompositerQuad.material.uniforms["tDiffuse"].value = this.accumulationRenderTarget.texture;
    this.effectCompositerQuad.material.uniforms["color"].value = this._c.copy(this.configuration.color).convertSRGBToLinear();
    this.effectCompositerQuad.material.uniforms["colorMultiply"].value = this.configuration.colorMultiply;
    this.effectCompositerQuad.material.uniforms["cameraPos"].value = this.camera.getWorldPosition(new Vector3());
    this.effectCompositerQuad.material.uniforms["fog"].value = !!this.scene.fog;
    if (this.scene.fog) {
      if (this.scene.fog.isFog) {
        this.effectCompositerQuad.material.uniforms["fogExp"].value = false;
        this.effectCompositerQuad.material.uniforms["fogNear"].value = this.scene.fog.near;
        this.effectCompositerQuad.material.uniforms["fogFar"].value = this.scene.fog.far;
      } else if (this.scene.fog.isFogExp2) {
        this.effectCompositerQuad.material.uniforms["fogExp"].value = true;
        this.effectCompositerQuad.material.uniforms["fogDensity"].value = this.scene.fog.density;
      } else console.error(`Unsupported fog type ${this.scene.fog.constructor.name} in SSAOPass.`);
    }
    renderer.setRenderTarget(
      /* this.renderToScreen ? null :
      outputBuffer*/
      this.outputTargetInternal
    );
    this.effectCompositerQuad.render(renderer);
    renderer.setRenderTarget(this.renderToScreen ? null : outputBuffer);
    this.copyQuad.material.uniforms["tDiffuse"].value = this.outputTargetInternal.texture;
    this.copyQuad.render(renderer);
    if (this.debugMode) {
      gl.endQuery(ext.TIME_ELAPSED_EXT);
      $87431ee93b037844$var$checkTimerQuery(timerQuery, gl, this);
    }
    renderer.xr.enabled = xrEnabled;
  }
  /**
       * Enables the debug mode of the AO, meaning the lastTime value will be updated.
       */
  enableDebugMode() {
    this.debugMode = true;
  }
  /**
       * Disables the debug mode of the AO, meaning the lastTime value will not be updated.
       */
  disableDebugMode() {
    this.debugMode = false;
  }
  /**
       * Sets the display mode of the AO
       * @param {"Combined" | "AO" | "No AO" | "Split" | "Split AO"} mode - The display mode. 
       */
  setDisplayMode(mode) {
    this.configuration.renderMode = [
      "Combined",
      "AO",
      "No AO",
      "Split",
      "Split AO"
    ].indexOf(mode);
  }
  /**
       * 
       * @param {"Performance" | "Low" | "Medium" | "High" | "Ultra"} mode 
       */
  setQualityMode(mode) {
    if (mode === "Performance") {
      this.configuration.aoSamples = 8;
      this.configuration.denoiseSamples = 4;
      this.configuration.denoiseRadius = 12;
    } else if (mode === "Low") {
      this.configuration.aoSamples = 16;
      this.configuration.denoiseSamples = 4;
      this.configuration.denoiseRadius = 12;
    } else if (mode === "Medium") {
      this.configuration.aoSamples = 16;
      this.configuration.denoiseSamples = 8;
      this.configuration.denoiseRadius = 12;
    } else if (mode === "High") {
      this.configuration.aoSamples = 64;
      this.configuration.denoiseSamples = 8;
      this.configuration.denoiseRadius = 6;
    } else if (mode === "Ultra") {
      this.configuration.aoSamples = 64;
      this.configuration.denoiseSamples = 16;
      this.configuration.denoiseRadius = 6;
    }
  }
};
var $05f6997e4b65da14$export$ed4ee5d1e55474a5 = {
  Default: 1,
  Log: 2,
  Reverse: 3
};

// node_modules/@react-three/postprocessing/dist/index.js
var H = (0, import_react.createContext)(null);
function pt({ children: e, enabled: t = true }) {
  const [o, r] = (0, import_react.useState)([]), a = (0, import_react.useMemo)(() => ({ selected: o, select: r, enabled: t }), [o, r, t]);
  return (0, import_jsx_runtime.jsx)(H.Provider, { value: a, children: e });
}
function mt({ enabled: e = false, children: t, ...o }) {
  const r = (0, import_react.useRef)(null), a = (0, import_react.useContext)(H);
  return (0, import_react.useEffect)(() => {
    if (a && e) {
      let n = false;
      const i = [];
      if (r.current.traverse((s) => {
        s.type === "Mesh" && i.push(s), a.selected.indexOf(s) === -1 && (n = true);
      }), n) return a.select((s) => [...s, ...i]), () => {
        a.select((s) => s.filter((l) => !i.includes(l)));
      };
    }
  }, [e, t, a]), (0, import_jsx_runtime.jsx)("group", { ref: r, ...o, children: t });
}
var D = (0, import_react.createContext)(null);
var ie = (e) => (e.getAttributes() & 2) === 2;
var dt = (0, import_react.memo)((0, import_react.forwardRef)(({ children: e, camera: t, scene: o, resolutionScale: r, enabled: a = true, renderPriority: n = 1, autoClear: i = true, depthBuffer: s, enableNormalPass: l, stencilBuffer: p2, multisampling: _ = 8, frameBufferType: S = HalfFloatType }, g) => {
  const { gl: d, scene: m2, camera: v3, size: x } = useThree(), f = o || m2, u = t || v3, [c2, U, b] = (0, import_react.useMemo)(() => {
    const C2 = new EffectComposer(d, { depthBuffer: s, stencilBuffer: p2, multisampling: _, frameBufferType: S });
    C2.addPass(new RenderPass(f, u));
    let R = null, E = null;
    return l && (E = new NormalPass(f, u), E.enabled = false, C2.addPass(E), r !== void 0 && (R = new DepthDownsamplingPass({ normalBuffer: E.texture, resolutionScale: r }), R.enabled = false, C2.addPass(R))), [C2, E, R];
  }, [u, d, s, p2, _, S, f, l, r]);
  (0, import_react.useEffect)(() => c2?.setSize(x.width, x.height), [c2, x]), useFrame((C2, R) => {
    if (a) {
      const E = d.autoClear;
      d.autoClear = i, p2 && !i && d.clearStencil(), c2.render(R), d.autoClear = E;
    }
  }, a ? n : 0);
  const F = (0, import_react.useRef)(null);
  (0, import_react.useLayoutEffect)(() => {
    const C2 = [], R = F.current.__r3f;
    if (R && c2) {
      const E = R.children;
      for (let T2 = 0; T2 < E.length; T2++) {
        const N = E[T2].object;
        if (N instanceof Effect) {
          const q = [N];
          if (!ie(N)) {
            let G = null;
            for (; (G = E[T2 + 1]?.object) instanceof Effect && !ie(G); ) q.push(G), T2++;
          }
          const $ = new EffectPass(u, ...q);
          C2.push($);
        } else N instanceof Pass && C2.push(N);
      }
      for (const T2 of C2) c2?.addPass(T2);
      U && (U.enabled = true), b && (b.enabled = true);
    }
    return () => {
      for (const E of C2) c2?.removePass(E);
      U && (U.enabled = false), b && (b.enabled = false);
    };
  }, [c2, e, u, U, b]), (0, import_react.useEffect)(() => {
    const C2 = d.toneMapping;
    return d.toneMapping = NoToneMapping, () => {
      d.toneMapping = C2;
    };
  }, [d]);
  const X = (0, import_react.useMemo)(() => ({ composer: c2, normalPass: U, downSamplingPass: b, resolutionScale: r, camera: u, scene: f }), [c2, U, b, r, u, f]);
  return (0, import_react.useImperativeHandle)(g, () => c2, [c2]), (0, import_jsx_runtime.jsx)(D.Provider, { value: X, children: (0, import_jsx_runtime.jsx)("group", { ref: F, children: e }) });
}));
var k = (e) => typeof e == "object" && e != null && "current" in e ? e.current : e;
var vt = 0;
var le = /* @__PURE__ */ new WeakMap();
var P2 = (e, t) => function({ blendFunction: o = t?.blendFunction, opacity: r = t?.opacity, ...a }) {
  let n = le.get(e);
  if (!n) {
    const l = `@react-three/postprocessing/${e.name}-${vt++}`;
    extend({ [l]: e }), le.set(e, n = l);
  }
  const i = useThree((l) => l.camera), s = import_react.default.useMemo(() => [...t?.args ?? [], ...a.args ?? [{ ...t, ...a }]], [JSON.stringify(a)]);
  return (0, import_jsx_runtime.jsx)(n, { camera: i, "blendMode-blendFunction": o, "blendMode-opacity-value": r, ...a, args: s });
};
var Z = (e, t) => {
  const o = e[t];
  return import_react.default.useMemo(() => typeof o == "number" ? new Vector2(o, o) : o ? new Vector2(...o) : new Vector2(), [o]);
};
var ce = (0, import_react.forwardRef)(function({ blendFunction: e, worldFocusDistance: t, worldFocusRange: o, focusDistance: r, focusRange: a, focalLength: n, bokehScale: i, resolutionScale: s, resolutionX: l, resolutionY: p2, width: _, height: S, target: g, depthTexture: d, ...m2 }, v3) {
  const { camera: x } = (0, import_react.useContext)(D), f = g != null, u = (0, import_react.useMemo)(() => {
    const c2 = new DepthOfFieldEffect(x, { blendFunction: e, worldFocusDistance: t, worldFocusRange: o, focusDistance: r, focusRange: a, focalLength: n, bokehScale: i, resolutionScale: s, resolutionX: l, resolutionY: p2, width: _, height: S });
    f && (c2.target = new Vector3()), d && c2.setDepthTexture(d.texture, d.packing);
    const U = c2.maskPass;
    return U.maskFunction = MaskFunction.MULTIPLY_RGB_SET_ALPHA, c2;
  }, [x, e, t, o, r, a, n, i, s, l, p2, _, S, f, d]);
  return (0, import_react.useEffect)(() => () => {
    u.dispose();
  }, [u]), (0, import_jsx_runtime.jsx)("primitive", { ...m2, ref: v3, object: u, target: g });
});
var ht = (0, import_react.forwardRef)(({ target: e = void 0, mouse: t = false, debug: o = void 0, manual: r = false, smoothTime: a = 0.25, ...n }, i) => {
  const s = (0, import_react.useRef)(null), l = (0, import_react.useRef)(null), p2 = (0, import_react.useRef)(null), _ = useThree(({ scene: b }) => b), S = useThree(({ pointer: b }) => b), { composer: g, camera: d } = (0, import_react.useContext)(D), [m2] = (0, import_react.useState)(() => new DepthPickingPass()), [v3] = (0, import_react.useState)(() => new CopyPass());
  (0, import_react.useEffect)(() => (g.addPass(m2), g.addPass(v3), () => {
    g.removePass(m2), g.removePass(v3);
  }), [g, m2, v3]), (0, import_react.useEffect)(() => () => {
    m2.dispose(), v3.dispose();
  }, [m2, v3]);
  const [x] = (0, import_react.useState)(() => new Vector3(0, 0, 0)), [f] = (0, import_react.useState)(() => new Vector3(0, 0, 0)), u = (0, import_react.useCallback)(async (b, F) => (f.x = b, f.y = F, f.z = await m2.readDepth(f), f.z = f.z * 2 - 1, 1 - f.z > 1e-7 ? f.unproject(d) : false), [f, m2, d]), c2 = (0, import_react.useCallback)(async (b, F = true) => {
    if (e) x.set(...e);
    else {
      const { x: X, y: C2 } = t ? S : { x: 0, y: 0 }, R = await u(X, C2);
      R && x.copy(R);
    }
    F && s.current?.target && (a > 0 && b > 0 ? easing.damp3(s.current.target, x, a, b) : s.current.target.copy(x));
  }, [e, x, t, u, a, S]);
  useFrame(async (b, F) => {
    r || c2(F), l.current && l.current.position.copy(x), p2.current && s.current?.target && p2.current.position.copy(s.current.target);
  });
  const U = (0, import_react.useMemo)(() => ({ dofRef: s, hitpoint: x, update: c2 }), [x, c2]);
  return (0, import_react.useImperativeHandle)(i, () => U, [U]), (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [o ? createPortal((0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [(0, import_jsx_runtime.jsxs)("mesh", { ref: l, children: [(0, import_jsx_runtime.jsx)("sphereGeometry", { args: [o, 16, 16] }), (0, import_jsx_runtime.jsx)("meshBasicMaterial", { color: "#00ff00", opacity: 1, transparent: true, depthWrite: false })] }), (0, import_jsx_runtime.jsxs)("mesh", { ref: p2, children: [(0, import_jsx_runtime.jsx)("sphereGeometry", { args: [o / 2, 16, 16] }), (0, import_jsx_runtime.jsx)("meshBasicMaterial", { color: "#00ff00", opacity: 0.5, transparent: true, depthWrite: false })] })] }), _) : null, (0, import_jsx_runtime.jsx)(ce, { ref: s, ...n, target: x })] });
});
var _t = { fragmentShader: `
    uniform float time;
    uniform vec2 lensPosition;
    uniform vec2 screenRes;
    uniform vec3 colorGain;
    uniform float starPoints;
    uniform float glareSize;
    uniform float flareSize;
    uniform float flareSpeed;
    uniform float flareShape;
    uniform float haloScale;
    uniform float opacity;
    uniform bool animated;
    uniform bool anamorphic;
    uniform bool enabled;
    uniform bool secondaryGhosts;
    uniform bool starBurst;
    uniform float ghostScale;
    uniform bool aditionalStreaks;
    uniform sampler2D lensDirtTexture;
    vec2 vTexCoord;
    
    float rand(float n){return fract(sin(n) * 43758.5453123);}

    float noise(float p){
      float fl = floor(p);
      float fc = fract(p);
      return mix(rand(fl),rand(fl + 1.0), fc);
    }

    vec3 hsv2rgb(vec3 c)
    {
      vec4 k = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
      vec3 p = abs(fract(c.xxx + k.xyz) * 6.0 - k.www);
      return c.z * mix(k.xxx, clamp(p - k.xxx, 0.0, 1.0), c.y);
    }

    float saturate(float x)
    {
      return clamp(x, 0.,1.);
    }

    vec2 rotateUV(vec2 uv, float rotation)
    {
      return vec2(
          cos(rotation) * uv.x + sin(rotation) * uv.y,
          cos(rotation) * uv.y - sin(rotation) * uv.x
      );
    }

    // Based on https://www.shadertoy.com/view/XtKfRV
    vec3 drawflare(vec2 p, float intensity, float rnd, float speed, int id)
    {
      float flarehueoffset = (1. / 32.) * float(id) * 0.1;
      float lingrad = distance(vec2(0.), p);
      float expgrad = 1. / exp(lingrad * (fract(rnd) * 0.66 + 0.33));
      vec3 colgrad = hsv2rgb(vec3( fract( (expgrad * 8.) + speed * flareSpeed + flarehueoffset), pow(1.-abs(expgrad*2.-1.), 0.45), 20.0 * expgrad * intensity)); //rainbow spectrum effect

      float internalStarPoints;

      if(anamorphic){
        internalStarPoints = 1.0;
      } else{
        internalStarPoints = starPoints;
      }
      
      float blades = length(p * flareShape * sin(internalStarPoints * atan(p.x, p.y)));
      
      float comp = pow(1.-saturate(blades), ( anamorphic ? 100. : 12.));
      comp += saturate(expgrad-0.9) * 3.;
      comp = pow(comp * expgrad, 8. + (1.-intensity) * 5.);
      
      if(flareSpeed > 0.0){
        return vec3(comp) * colgrad;
      } else{
        return vec3(comp) * flareSize * 15.;
      }
    }

    float dist(vec3 a, vec3 b) { return abs(a.x - b.x) + abs(a.y - b.y) + abs(a.z - b.z); }

    vec3 saturate(vec3 x)
    {
      return clamp(x, vec3(0.0), vec3(1.0));
    }

    // Based on https://www.shadertoy.com/view/XtKfRV
    float glare(vec2 uv, vec2 pos, float size)
    {
      vec2 main;

      if(animated){
        main = rotateUV(uv-pos, time * 0.1);      
      } else{
        main = uv-pos;     
      }
      
      float ang = atan(main.y, main.x) * (anamorphic ? 1.0 : starPoints);
      float dist = length(main); 
      dist = pow(dist, .9);
      
      float f0 = 1.0/(length(uv-pos)*(1.0/size*16.0)+.2);

      return f0+f0*(sin((ang))*.2 +.3);
    }

    float sdHex(vec2 p){
      p = abs(p);
      vec2 q = vec2(p.x*2.0*0.5773503, p.y + p.x*0.5773503);
      return dot(step(q.xy,q.yx), 1.0-q.yx);
    }

    //Based on https://www.shadertoy.com/view/dllSRX
    float fpow(float x, float k){
      return x > k ? pow((x-k)/(1.0-k),2.0) : 0.0;
    }

    vec3 renderhex(vec2 uv, vec2 p, float s, vec3 col){
      uv -= p;
      if (abs(uv.x) < 0.2*s && abs(uv.y) < 0.2*s){
          return mix(vec3(0),mix(vec3(0),col,0.1 + fpow(length(uv/s),0.1)*10.0),smoothstep(0.0,0.1,sdHex(uv*20.0/s)));
      }
      return vec3(0);
    }

    // Based on https://www.shadertoy.com/view/4sX3Rs
    vec3 LensFlare(vec2 uv, vec2 pos)
    {
      vec2 main = uv-pos;
      vec2 uvd = uv*(length(uv));
      
      float ang = atan(main.x,main.y);
      
      float f0 = .3/(length(uv-pos)*16.0+1.0);
      
      f0 = f0*(sin(noise(sin(ang*3.9-(animated ? time : 0.0) * 0.3) * starPoints))*.2 );
      
      float f1 = max(0.01-pow(length(uv+1.2*pos),1.9),.0)*7.0;

      float f2 = max(.9/(10.0+32.0*pow(length(uvd+0.99*pos),2.0)),.0)*0.35;
      float f22 = max(.9/(11.0+32.0*pow(length(uvd+0.85*pos),2.0)),.0)*0.23;
      float f23 = max(.9/(12.0+32.0*pow(length(uvd+0.95*pos),2.0)),.0)*0.6;
      
      vec2 uvx = mix(uv,uvd, 0.1);
      
      float f4 = max(0.01-pow(length(uvx+0.4*pos),2.9),.0)*4.02;
      float f42 = max(0.0-pow(length(uvx+0.45*pos),2.9),.0)*4.1;
      float f43 = max(0.01-pow(length(uvx+0.5*pos),2.9),.0)*4.6;
      
      uvx = mix(uv,uvd,-.4);
      
      float f5 = max(0.01-pow(length(uvx+0.1*pos),5.5),.0)*2.0;
      float f52 = max(0.01-pow(length(uvx+0.2*pos),5.5),.0)*2.0;
      float f53 = max(0.01-pow(length(uvx+0.1*pos),5.5),.0)*2.0;
      
      uvx = mix(uv,uvd, 2.1);
      
      float f6 = max(0.01-pow(length(uvx-0.3*pos),1.61),.0)*3.159;
      float f62 = max(0.01-pow(length(uvx-0.325*pos),1.614),.0)*3.14;
      float f63 = max(0.01-pow(length(uvx-0.389*pos),1.623),.0)*3.12;
      
      vec3 c = vec3(glare(uv,pos, glareSize));

      vec2 prot;

      if(animated){
        prot = rotateUV(uv - pos, (time * 0.1));  
      } else if(anamorphic){
        prot = rotateUV(uv - pos, 1.570796);     
      } else {
        prot = uv - pos;
      }

      c += drawflare(prot, (anamorphic ? flareSize * 10. : flareSize), 0.1, time, 1);
      
      c.r+=f1+f2+f4+f5+f6; c.g+=f1+f22+f42+f52+f62; c.b+=f1+f23+f43+f53+f63;
      c = c*1.3 * vec3(length(uvd)+.09);
      c+=vec3(f0);
      
      return c;
    }

    vec3 cc(vec3 color, float factor,float factor2)
    {
      float w = color.x+color.y+color.z;
      return mix(color,vec3(w)*factor,w*factor2);
    }    

    float rnd(vec2 p)
    {
      float f = fract(sin(dot(p, vec2(12.1234, 72.8392) )*45123.2));
      return f;   
    }

    float rnd(float w)
    {
      float f = fract(sin(w)*1000.);
      return f;   
    }

    float regShape(vec2 p, int N)
    {
      float f;
      
      float a=atan(p.x,p.y)+.2;
      float b=6.28319/float(N);
      f=smoothstep(.5,.51, cos(floor(.5+a/b)*b-a)*length(p.xy)* 2.0  -ghostScale);
          
      return f;
    }

    // Based on https://www.shadertoy.com/view/Xlc3D2
    vec3 circle(vec2 p, float size, float decay, vec3 color, vec3 color2, float dist, vec2 position)
    {
      float l = length(p + position*(dist*2.))+size/2.;
      float l2 = length(p + position*(dist*4.))+size/3.;
      
      float c = max(0.01-pow(length(p + position*dist), size*ghostScale), 0.0)*10.;
      float c1 = max(0.001-pow(l-0.3, 1./40.)+sin(l*20.), 0.0)*3.;
      float c2 =  max(0.09/pow(length(p-position*dist/.5)*1., .95), 0.0)/20.;
      float s = max(0.02-pow(regShape(p*5. + position*dist*5. + decay, 6) , 1.), 0.0)*1.5;
      
      color = cos(vec3(0.44, .24, .2)*16. + dist/8.)*0.5+.5;
      vec3 f = c*color;
      f += c1*color;
      f += c2*color;  
      f +=  s*color;
      return f;
    }

    vec4 getLensColor(float x){
      return vec4(vec3(mix(mix(mix(mix(mix(mix(mix(mix(mix(mix(mix(mix(mix(mix(mix(vec3(0., 0., 0.),
        vec3(0., 0., 0.), smoothstep(0.0, 0.063, x)),
        vec3(0., 0., 0.), smoothstep(0.063, 0.125, x)),
        vec3(0.0, 0., 0.), smoothstep(0.125, 0.188, x)),
        vec3(0.188, 0.131, 0.116), smoothstep(0.188, 0.227, x)),
        vec3(0.31, 0.204, 0.537), smoothstep(0.227, 0.251, x)),
        vec3(0.192, 0.106, 0.286), smoothstep(0.251, 0.314, x)),
        vec3(0.102, 0.008, 0.341), smoothstep(0.314, 0.392, x)),
        vec3(0.086, 0.0, 0.141), smoothstep(0.392, 0.502, x)),
        vec3(1.0, 0.31, 0.0), smoothstep(0.502, 0.604, x)),
        vec3(.1, 0.1, 0.1), smoothstep(0.604, 0.643, x)),
        vec3(1.0, 0.929, 0.0), smoothstep(0.643, 0.761, x)),
        vec3(1.0, 0.086, 0.424), smoothstep(0.761, 0.847, x)),
        vec3(1.0, 0.49, 0.0), smoothstep(0.847, 0.89, x)),
        vec3(0.945, 0.275, 0.475), smoothstep(0.89, 0.941, x)),
        vec3(0.251, 0.275, 0.796), smoothstep(0.941, 1.0, x))),
      1.0);
    }

    float dirtNoise(vec2 p){
      vec2 f = fract(p);
      f = (f * f) * (3.0 - (2.0 * f));    
      float n = dot(floor(p), vec2(1.0, 157.0));
      vec4 a = fract(sin(vec4(n + 0.0, n + 1.0, n + 157.0, n + 158.0)) * 43758.5453123);
      return mix(mix(a.x, a.y, f.x), mix(a.z, a.w, f.x), f.y);
    } 

    float fbm(vec2 p){
      const mat2 m = mat2(0.80, -0.60, 0.60, 0.80);
      float f = 0.0;
      f += 0.5000*dirtNoise(p); p = m*p*2.02;
      f += 0.2500*dirtNoise(p); p = m*p*2.03;
      f += 0.1250*dirtNoise(p); p = m*p*2.01;
      f += 0.0625*dirtNoise(p);
      return f/0.9375;
    }

    vec4 getLensStar(vec2 p){
      vec2 pp = (p - vec2(0.5)) * 2.0;
      float a = atan(pp.y, pp.x);
      vec4 cp = vec4(sin(a * 1.0), length(pp), sin(a * 13.0), sin(a * 53.0));
      float d = sin(clamp(pow(length(vec2(0.5) - p) * 0.5 + haloScale /2., 5.0), 0.0, 1.0) * 3.14159);
      vec3 c = vec3(d) * vec3(fbm(cp.xy * 16.0) * fbm(cp.zw * 9.0) * max(max(max(max(0.5, sin(a * 1.0)), sin(a * 3.0) * 0.8), sin(a * 7.0) * 0.8), sin(a * 9.0) * 10.6));
      c *= vec3(mix(2.0, (sin(length(pp.xy) * 256.0) * 0.5) + 0.5, sin((clamp((length(pp.xy) - 0.875) / 0.1, 0.0, 1.0) + 0.0) * 2.0 * 3.14159) * 1.5) + 0.5) * 0.3275;
      return vec4(vec3(c * 1.0), d);	
    }

    vec4 getLensDirt(vec2 p){
      p.xy += vec2(fbm(p.yx * 3.0), fbm(p.yx * 2.0)) * 0.0825;
      vec3 o = vec3(mix(0.125, 0.25, max(max(smoothstep(0.1, 0.0, length(p - vec2(0.25))),
                                            smoothstep(0.4, 0.0, length(p - vec2(0.75)))),
                                            smoothstep(0.8, 0.0, length(p - vec2(0.875, 0.125))))));
      o += vec3(max(fbm(p * 1.0) - 0.5, 0.0)) * 0.5;
      o += vec3(max(fbm(p * 2.0) - 0.5, 0.0)) * 0.5;
      o += vec3(max(fbm(p * 4.0) - 0.5, 0.0)) * 0.25;
      o += vec3(max(fbm(p * 8.0) - 0.75, 0.0)) * 1.0;
      o += vec3(max(fbm(p * 16.0) - 0.75, 0.0)) * 0.75;
      o += vec3(max(fbm(p * 64.0) - 0.75, 0.0)) * 0.5;
      return vec4(clamp(o, vec3(0.15), vec3(1.0)), 1.0);	
    }

    vec4 textureLimited(sampler2D tex, vec2 texCoord){
      if(((texCoord.x < 0.) || (texCoord.y < 0.)) || ((texCoord.x > 1.) || (texCoord.y > 1.))){
        return vec4(0.0);
      }else{
        return texture(tex, texCoord); 
      }
    }

    vec4 textureDistorted(sampler2D tex, vec2 texCoord, vec2 direction, vec3 distortion) {
      return vec4(textureLimited(tex, (texCoord + (direction * distortion.r))).r,
                  textureLimited(tex, (texCoord + (direction * distortion.g))).g,
                  textureLimited(tex, (texCoord + (direction * distortion.b))).b,
                  1.0);
    }

    // Based on https://www.shadertoy.com/view/4sK3W3
    vec4 getStartBurst(){
      vec2 aspectTexCoord = vec2(1.0) - (((vTexCoord - vec2(0.5)) * vec2(1.0)) + vec2(0.5)); 
      vec2 texCoord = vec2(1.0) - vTexCoord; 
      vec2 ghostVec = (vec2(0.5) - texCoord) * 0.3 - lensPosition;
      vec2 ghostVecAspectNormalized = normalize(ghostVec * vec2(1.0)) * vec2(1.0);
      vec2 haloVec = normalize(ghostVec) * 0.6;
      vec2 haloVecAspectNormalized = ghostVecAspectNormalized * 0.6;
      vec2 texelSize = vec2(1.0) / vec2(screenRes.xy);
      vec3 distortion = vec3(-(texelSize.x * 1.5), 0.2, texelSize.x * 1.5);
      vec4 c = vec4(0.0);
      for (int i = 0; i < 8; i++) {
        vec2 offset = texCoord + (ghostVec * float(i));
        c += textureDistorted(lensDirtTexture, offset, ghostVecAspectNormalized, distortion) * pow(max(0.0, 1.0 - (length(vec2(0.5) - offset) / length(vec2(0.5)))), 10.0);
      }                       
      vec2 haloOffset = texCoord + haloVecAspectNormalized; 
      return (c * getLensColor((length(vec2(0.5) - aspectTexCoord) / length(vec2(haloScale))))) + 
            (textureDistorted(lensDirtTexture, haloOffset, ghostVecAspectNormalized, distortion) * pow(max(0.0, 1.0 - (length(vec2(0.5) - haloOffset) / length(vec2(0.5)))), 10.0));
    } 

    void mainImage(vec4 inputColor, vec2 uv, out vec4 outputColor)
    {
      vec2 myUV = uv -0.5;
      myUV.y *= screenRes.y/screenRes.x;
      vec2 finalLensPosition = lensPosition * 0.5;
      finalLensPosition.y *= screenRes.y/screenRes.x;
      
      //First Lens flare pass
      vec3 finalColor = LensFlare(myUV, finalLensPosition) * 20.0 * colorGain / 256.;

      //Aditional streaks
      if(aditionalStreaks){
        vec3 circColor = vec3(0.9, 0.2, 0.1);
        vec3 circColor2 = vec3(0.3, 0.1, 0.9);

        for(float i=0.;i<10.;i++){
          finalColor += circle(myUV, pow(rnd(i*2000.)*2.8, .1)+1.41, 0.0, circColor+i , circColor2+i, rnd(i*20.)*3.+0.2-.5, lensPosition);
        }
      }

      //Alternative ghosts
      if(secondaryGhosts){
        vec3 altGhosts = vec3(0);
        altGhosts += renderhex(myUV, -lensPosition*0.25, ghostScale * 1.4, vec3(0.25,0.35,0));
        altGhosts += renderhex(myUV, lensPosition*0.25, ghostScale * 0.5, vec3(1,0.5,0.5));
        altGhosts += renderhex(myUV, lensPosition*0.1, ghostScale * 1.6, vec3(1,1,1));
        altGhosts += renderhex(myUV, lensPosition*1.8, ghostScale * 2.0, vec3(0,0.5,0.75));
        altGhosts += renderhex(myUV, lensPosition*1.25, ghostScale * 0.8, vec3(1,1,0.5));
        altGhosts += renderhex(myUV, -lensPosition*1.25, ghostScale * 5.0, vec3(0.5,0.5,0.25));
        
        //Circular ghosts
        altGhosts += fpow(1.0 - abs(distance(lensPosition*0.8,myUV) - 0.7),0.985)*colorGain / 2100.;
        finalColor += altGhosts;
      }
      

      //Starburst                     
      if(starBurst){
        vTexCoord = myUV + 0.5;
        vec4 lensMod = getLensDirt(myUV);
        float tooBright = 1.0 - (clamp(0.5, 0.0, 0.5) * 2.0); 
        float tooDark = clamp(0.5 - 0.5, 0.0, 0.5) * 2.0;
        lensMod += mix(lensMod, pow(lensMod * 2.0, vec4(2.0)) * 0.5, tooBright);
        float lensStarRotationAngle = ((myUV.x + myUV.y)) * (1.0 / 6.0);
        vec2 lensStarTexCoord = (mat2(cos(lensStarRotationAngle), -sin(lensStarRotationAngle), sin(lensStarRotationAngle), cos(lensStarRotationAngle)) * vTexCoord);
        lensMod += getLensStar(lensStarTexCoord) * 2.;
        
        finalColor += clamp((lensMod.rgb * getStartBurst().rgb ), 0.01, 1.0);
      }

      //Final composed output
      if(enabled){
        outputColor = vec4(mix(finalColor, vec3(.0), opacity) + inputColor.rgb, inputColor.a);
      } else {
        outputColor = vec4(inputColor);
      }
    }
  ` };
var fe = class extends Effect {
  constructor({ blendFunction: t, enabled: o, glareSize: r, lensPosition: a, screenRes: n, starPoints: i, flareSize: s, flareSpeed: l, flareShape: p2, animated: _, anamorphic: S, colorGain: g, lensDirtTexture: d, haloScale: m2, secondaryGhosts: v3, aditionalStreaks: x, ghostScale: f, opacity: u, starBurst: c2 }) {
    super("LensFlareEffect", _t.fragmentShader, { blendFunction: t, uniforms: /* @__PURE__ */ new Map([["enabled", new Uniform(o)], ["glareSize", new Uniform(r)], ["lensPosition", new Uniform(a)], ["time", new Uniform(0)], ["screenRes", new Uniform(n)], ["starPoints", new Uniform(i)], ["flareSize", new Uniform(s)], ["flareSpeed", new Uniform(l)], ["flareShape", new Uniform(p2)], ["animated", new Uniform(_)], ["anamorphic", new Uniform(S)], ["colorGain", new Uniform(g)], ["lensDirtTexture", new Uniform(d)], ["haloScale", new Uniform(m2)], ["secondaryGhosts", new Uniform(v3)], ["aditionalStreaks", new Uniform(x)], ["ghostScale", new Uniform(f)], ["starBurst", new Uniform(c2)], ["opacity", new Uniform(u)]]) });
  }
  update(t, o, r) {
    const a = this.uniforms.get("time");
    a && (a.value += r);
  }
};
var xt = P2(fe);
var gt = ({ smoothTime: e = 0.07, blendFunction: t = 23, enabled: o = true, glareSize: r = 0.2, lensPosition: a = new Vector3(-25, 6, -60), screenRes: n = new Vector2(0, 0), starPoints: i = 6, flareSize: s = 0.01, flareSpeed: l = 0.01, flareShape: p2 = 0.01, animated: _ = true, anamorphic: S = false, colorGain: g = new Color(20, 20, 20), lensDirtTexture: d = null, haloScale: m2 = 0.5, secondaryGhosts: v3 = true, aditionalStreaks: x = true, ghostScale: f = 0, opacity: u = 1, starBurst: c2 = false }) => {
  const U = useThree(({ viewport: T2 }) => T2), b = useThree(({ raycaster: T2 }) => T2), { scene: F, camera: X } = (0, import_react.useContext)(D), [C2] = (0, import_react.useState)(() => new Vector2()), [R] = (0, import_react.useState)(() => new Vector3()), E = (0, import_react.useRef)(null);
  return useFrame((T2, N) => {
    if (!E?.current) return;
    const q = E.current.uniforms.get("lensPosition"), $ = E.current.uniforms.get("opacity");
    if (!q || !$) return;
    let G = 1;
    if (R.copy(a).project(X), R.z > 1) return;
    q.value.x = R.x, q.value.y = R.y, C2.x = R.x, C2.y = R.y, b.setFromCamera(C2, X);
    const ve = b.intersectObjects(F.children, true), { object: I } = ve[0] || {};
    I && (I.userData?.lensflare === "no-occlusion" ? G = 0 : I instanceof Mesh && (I.material.uniforms?._transmission?.value > 0.2 || I.material._transmission && I.material._transmission > 0.2 ? G = 0.2 : I.material.transparent && (G = I.material.opacity))), easing.damp($, "value", G, e, N);
  }), (0, import_react.useEffect)(() => {
    if (!E?.current) return;
    const T2 = E.current.uniforms.get("screenRes");
    T2 && (T2.value.x = U.width, T2.value.y = U.height);
  }, [U]), (0, import_jsx_runtime.jsx)(xt, { ref: E, blendFunction: t, enabled: o, glareSize: r, lensPosition: a, screenRes: n, starPoints: i, flareSize: s, flareSpeed: l, flareShape: p2, animated: _, anamorphic: S, colorGain: g, lensDirtTexture: d, haloScale: m2, secondaryGhosts: v3, aditionalStreaks: x, ghostScale: f, opacity: u, starBurst: c2 });
};
var wt = P2(BloomEffect, { blendFunction: 0 });
var St = P2(BrightnessContrastEffect);
var yt = P2(ChromaticAberrationEffect);
var Pt = (0, import_react.forwardRef)(function({ blendFunction: e = 23 }, t) {
  const o = (0, import_react.useMemo)(() => new ColorAverageEffect(e), [e]);
  return (0, import_jsx_runtime.jsx)("primitive", { ref: t, object: o, dispose: null });
});
var bt = P2(ColorDepthEffect);
var Et = P2(DepthEffect);
var Rt = P2(DotScreenEffect);
var Ut = (0, import_react.forwardRef)(function({ active: e = true, ...t }, o) {
  const r = useThree((p2) => p2.invalidate), a = Z(t, "delay"), n = Z(t, "duration"), i = Z(t, "strength"), s = Z(t, "chromaticAberrationOffset"), l = (0, import_react.useMemo)(() => new GlitchEffect({ ...t, delay: a, duration: n, strength: i, chromaticAberrationOffset: s }), [a, n, t, i, s]);
  return (0, import_react.useLayoutEffect)(() => {
    l.mode = e ? t.mode || GlitchMode.SPORADIC : GlitchMode.DISABLED, r();
  }, [e, l, r, t.mode]), (0, import_react.useEffect)(() => () => {
    l.dispose?.();
  }, [l]), (0, import_jsx_runtime.jsx)("primitive", { ref: o, object: l, dispose: null });
});
var Ct = (0, import_react.forwardRef)(function(e, t) {
  const { camera: o } = (0, import_react.useContext)(D), r = (0, import_react.useMemo)(() => new GodRaysEffect(o, k(e.sun), e), [o, e]);
  return (0, import_react.useLayoutEffect)(() => void (r.lightSource = k(e.sun)), [r, e.sun]), (0, import_jsx_runtime.jsx)("primitive", { ref: t, object: r, dispose: null });
});
var zt = (0, import_react.forwardRef)(function({ size: e, ...t }, o) {
  const r = useThree((n) => n.invalidate), a = (0, import_react.useMemo)(() => new GridEffect(t), [t]);
  return (0, import_react.useLayoutEffect)(() => {
    e && a.setSize(e.width, e.height), r();
  }, [a, e, r]), (0, import_jsx_runtime.jsx)("primitive", { ref: o, object: a, dispose: null });
});
var Tt = P2(HueSaturationEffect);
var At = P2(NoiseEffect, { blendFunction: 5 });
var Bt = (0, import_react.forwardRef)(function({ selection: e = [], selectionLayer: t = 10, blendFunction: o, patternTexture: r, edgeStrength: a, pulseSpeed: n, visibleEdgeColor: i, hiddenEdgeColor: s, width: l, height: p2, kernelSize: _, blur: S, xRay: g, ...d }, m2) {
  const v3 = useThree((U) => U.invalidate), { scene: x, camera: f } = (0, import_react.useContext)(D), u = (0, import_react.useMemo)(() => new OutlineEffect(x, f, { blendFunction: o, patternTexture: r, edgeStrength: a, pulseSpeed: n, visibleEdgeColor: i, hiddenEdgeColor: s, width: l, height: p2, kernelSize: _, blur: S, xRay: g, ...d }), [o, S, f, a, p2, s, _, r, n, x, i, l, g]), c2 = (0, import_react.useContext)(H);
  return (0, import_react.useEffect)(() => {
    if (!c2 && e) return u.selection.set(Array.isArray(e) ? e.map(k) : [k(e)]), v3(), () => {
      u.selection.clear(), v3();
    };
  }, [u, e, c2, v3]), (0, import_react.useEffect)(() => {
    u.selectionLayer = t, v3();
  }, [u, v3, t]), (0, import_react.useRef)(void 0), (0, import_react.useEffect)(() => {
    if (c2 && c2.enabled && c2.selected?.length) return u.selection.set(c2.selected), v3(), () => {
      u.selection.clear(), v3();
    };
  }, [c2, u.selection, v3]), (0, import_react.useEffect)(() => () => {
    u.dispose();
  }, [u]), (0, import_jsx_runtime.jsx)("primitive", { ref: m2, object: u });
});
var Vt = (0, import_react.forwardRef)(function({ granularity: e = 5 }, t) {
  const o = (0, import_react.useMemo)(() => new PixelationEffect(e), [e]);
  return (0, import_jsx_runtime.jsx)("primitive", { ref: t, object: o, dispose: null });
});
var Ft = P2(ScanlineEffect, { blendFunction: 24, density: 1.25 });
var Mt = (e, t) => e.layers.enable(t.selection.layer);
var Dt = (e, t) => e.layers.disable(t.selection.layer);
var kt = (0, import_react.forwardRef)(function({ selection: e = [], selectionLayer: t = 10, lights: o = [], inverted: r = false, ignoreBackground: a = false, luminanceThreshold: n, luminanceSmoothing: i, intensity: s, width: l, height: p2, kernelSize: _, mipmapBlur: S, ...g }, d) {
  o.length === 0 && console.warn("SelectiveBloom requires lights to work.");
  const m2 = useThree((c2) => c2.invalidate), { scene: v3, camera: x } = (0, import_react.useContext)(D), f = (0, import_react.useMemo)(() => {
    const c2 = new SelectiveBloomEffect(v3, x, { blendFunction: 0, luminanceThreshold: n, luminanceSmoothing: i, intensity: s, width: l, height: p2, kernelSize: _, mipmapBlur: S, ...g });
    return c2.inverted = r, c2.ignoreBackground = a, c2;
  }, [v3, x, n, i, s, l, p2, _, S, r, a, g]), u = (0, import_react.useContext)(H);
  return (0, import_react.useEffect)(() => {
    if (!u && e) return f.selection.set(Array.isArray(e) ? e.map(k) : [k(e)]), m2(), () => {
      f.selection.clear(), m2();
    };
  }, [f, e, u, m2]), (0, import_react.useEffect)(() => {
    f.selection.layer = t, m2();
  }, [f, m2, t]), (0, import_react.useEffect)(() => {
    if (o && o.length > 0) return o.forEach((c2) => Mt(k(c2), f)), m2(), () => {
      o.forEach((c2) => Dt(k(c2), f)), m2();
    };
  }, [f, m2, o, t]), (0, import_react.useEffect)(() => {
    if (u && u.enabled && u.selected?.length) return f.selection.set(u.selected), m2(), () => {
      f.selection.clear(), m2();
    };
  }, [u, f.selection, m2]), (0, import_jsx_runtime.jsx)("primitive", { ref: d, object: f, dispose: null });
});
var Gt = P2(SepiaEffect);
var It = (0, import_react.forwardRef)(function(e, t) {
  const { camera: o, normalPass: r, downSamplingPass: a, resolutionScale: n } = (0, import_react.useContext)(D), i = (0, import_react.useMemo)(() => r === null && a === null ? (console.error("Please enable the NormalPass in the EffectComposer in order to use SSAO."), {}) : new SSAOEffect(o, r && !a ? r.texture : null, { blendFunction: 21, samples: 30, rings: 4, distanceThreshold: 1, distanceFalloff: 0, rangeThreshold: 0.5, rangeFalloff: 0.1, luminanceInfluence: 0.9, radius: 20, bias: 0.5, intensity: 1, color: void 0, normalDepthBuffer: a ? a.texture : null, resolutionScale: n ?? 1, depthAwareUpsampling: true, ...e }), [o, a, r, n]);
  return (0, import_jsx_runtime.jsx)("primitive", { ref: t, object: i, dispose: null });
});
var Lt = P2(SMAAEffect);
var Nt = P2(FXAAEffect);
var jt = { fragmentShader: `
    uniform int rampType;

    uniform vec2 rampStart;
    uniform vec2 rampEnd;

    uniform vec4 startColor;
    uniform vec4 endColor;

    uniform float rampBias;
    uniform float rampGain;

    uniform bool rampMask;
    uniform bool rampInvert;

    float getBias(float time, float bias) {
      return time / (((1.0 / bias) - 2.0) * (1.0 - time) + 1.0);
    }

    float getGain(float time, float gain) {
      if (time < 0.5)
        return getBias(time * 2.0, gain) / 2.0;
      else
        return getBias(time * 2.0 - 1.0, 1.0 - gain) / 2.0 + 0.5;
    }

    void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {
      vec2 centerPixel = uv * resolution;
      vec2 startPixel = rampStart * resolution;
      vec2 endPixel = rampEnd * resolution;

      float rampAlpha;

      if (rampType == 1) {
        vec2 fuv = centerPixel / resolution.y;
        vec2 suv = startPixel / resolution.y;
        vec2 euv = endPixel / resolution.y;

        float radius = length(suv - euv);
        float falloff = length(fuv - suv);
        rampAlpha = smoothstep(0.0, radius, falloff);
      } else {
        float radius = length(startPixel - endPixel);
        vec2 direction = normalize(vec2(endPixel.x - startPixel.x, -(startPixel.y - endPixel.y)));

        float fade = dot(centerPixel - startPixel, direction);
        if (rampType == 2) fade = abs(fade);

        rampAlpha = smoothstep(0.0, 1.0, fade / radius);
      }

      rampAlpha = abs((rampInvert ? 1.0 : 0.0) - getBias(rampAlpha, rampBias) * getGain(rampAlpha, rampGain));

      if (rampMask) {
        vec4 inputBuff = texture2D(inputBuffer, uv);
        outputColor = mix(inputBuff, inputColor, rampAlpha);
      } else {
        outputColor = mix(startColor, endColor, rampAlpha);
      }
    }
  ` };
var ue = ((e) => (e[e.Linear = 0] = "Linear", e[e.Radial = 1] = "Radial", e[e.MirroredLinear = 2] = "MirroredLinear", e))(ue || {});
var pe = class extends Effect {
  constructor({ rampType: t = 0, rampStart: o = [0.5, 0.5], rampEnd: r = [1, 1], startColor: a = [0, 0, 0, 1], endColor: n = [1, 1, 1, 1], rampBias: i = 0.5, rampGain: s = 0.5, rampMask: l = false, rampInvert: p2 = false, ..._ } = {}) {
    super("RampEffect", jt.fragmentShader, { ..._, uniforms: /* @__PURE__ */ new Map([["rampType", new Uniform(t)], ["rampStart", new Uniform(o)], ["rampEnd", new Uniform(r)], ["startColor", new Uniform(a)], ["endColor", new Uniform(n)], ["rampBias", new Uniform(i)], ["rampGain", new Uniform(s)], ["rampMask", new Uniform(l)], ["rampInvert", new Uniform(p2)]]) });
  }
};
var Ot = P2(pe);
var Wt = (0, import_react.forwardRef)(function({ textureSrc: e, texture: t, opacity: o = 1, ...r }, a) {
  const n = useLoader(TextureLoader, e);
  (0, import_react.useLayoutEffect)(() => {
    n.colorSpace = SRGBColorSpace, n.wrapS = n.wrapT = RepeatWrapping;
  }, [n]);
  const i = (0, import_react.useMemo)(() => new TextureEffect({ ...r, texture: n || t }), [r, n, t]);
  return (0, import_jsx_runtime.jsx)("primitive", { ref: a, object: i, "blendMode-opacity-value": o, dispose: null });
});
var Xt = P2(ToneMappingEffect);
var qt2 = P2(VignetteEffect);
var Ht = P2(ShockWaveEffect);
var Zt = (0, import_react.forwardRef)(function({ lut: e, tetrahedralInterpolation: t, ...o }, r) {
  const a = (0, import_react.useMemo)(() => new LUT3DEffect(e, o), [e, o]), n = useThree((i) => i.invalidate);
  return (0, import_react.useLayoutEffect)(() => {
    t && (a.tetrahedralInterpolation = t), e && (a.lut = e), n();
  }, [a, n, e, t]), (0, import_jsx_runtime.jsx)("primitive", { ref: r, object: a, dispose: null });
});
var $t = P2(TiltShiftEffect, { blendFunction: 0 });
var Kt = { fragmentShader: `

    // original shader by Evan Wallace

    #define MAX_ITERATIONS 100

    uniform float blur;
    uniform float taper;
    uniform vec2 start;
    uniform vec2 end;
    uniform vec2 direction;
    uniform int samples;

    float random(vec3 scale, float seed) {
        /* use the fragment position for a different seed per-pixel */
        return fract(sin(dot(gl_FragCoord.xyz + seed, scale)) * 43758.5453 + seed);
    }

    void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {
        vec4 color = vec4(0.0);
        float total = 0.0;
        vec2 startPixel = vec2(start.x * resolution.x, start.y * resolution.y);
        vec2 endPixel = vec2(end.x * resolution.x, end.y * resolution.y);
        float f_samples = float(samples);
        float half_samples = f_samples / 2.0;

        // use screen diagonal to normalize blur radii
        float maxScreenDistance = distance(vec2(0.0), resolution); // diagonal distance
        float gradientRadius = taper * (maxScreenDistance);
        float blurRadius = blur * (maxScreenDistance / 16.0);

        /* randomize the lookup values to hide the fixed number of samples */
        float offset = random(vec3(12.9898, 78.233, 151.7182), 0.0);
        vec2 normal = normalize(vec2(startPixel.y - endPixel.y, endPixel.x - startPixel.x));
        float radius = smoothstep(0.0, 1.0, abs(dot(uv * resolution - startPixel, normal)) / gradientRadius) * blurRadius;

        #pragma unroll_loop_start
        for (int i = 0; i <= MAX_ITERATIONS; i++) {
            if (i >= samples) { break; } // return early if over sample count
            float f_i = float(i);
            float s_i = -half_samples + f_i;
            float percent = (s_i + offset - 0.5) / half_samples;
            float weight = 1.0 - abs(percent);
            vec4 sample_i = texture2D(inputBuffer, uv + normalize(direction) / resolution * percent * radius);
            /* switch to pre-multiplied alpha to correctly blur transparent images */
            sample_i.rgb *= sample_i.a;
            color += sample_i * weight;
            total += weight;
        }
        #pragma unroll_loop_end

        outputColor = color / total;

        /* switch back from pre-multiplied alpha */
        outputColor.rgb /= outputColor.a + 0.00001;
    }
    ` };
var me = class extends Effect {
  constructor({ blendFunction: t = 23, blur: o = 0.15, taper: r = 0.5, start: a = [0.5, 0], end: n = [0.5, 1], samples: i = 10, direction: s = [1, 1] } = {}) {
    super("TiltShiftEffect", Kt.fragmentShader, { blendFunction: t, attributes: 2, uniforms: /* @__PURE__ */ new Map([["blur", new Uniform(o)], ["taper", new Uniform(r)], ["start", new Uniform(a)], ["end", new Uniform(n)], ["samples", new Uniform(i)], ["direction", new Uniform(s)]]) });
  }
};
var Yt = P2(me, { blendFunction: 23 });
var Jt = `
uniform sampler2D uCharacters;
uniform float uCharactersCount;
uniform float uCellSize;
uniform bool uInvert;
uniform vec3 uColor;

const vec2 SIZE = vec2(16.);

vec3 greyscale(vec3 color, float strength) {
    float g = dot(color, vec3(0.299, 0.587, 0.114));
    return mix(color, vec3(g), strength);
}

vec3 greyscale(vec3 color) {
    return greyscale(color, 1.0);
}

void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {
    vec2 cell = resolution / uCellSize;
    vec2 grid = 1.0 / cell;
    vec2 pixelizedUV = grid * (0.5 + floor(uv / grid));
    vec4 pixelized = texture2D(inputBuffer, pixelizedUV);
    float greyscaled = greyscale(pixelized.rgb).r;

    if (uInvert) {
        greyscaled = 1.0 - greyscaled;
    }

    float characterIndex = floor((uCharactersCount - 1.0) * greyscaled);
    vec2 characterPosition = vec2(mod(characterIndex, SIZE.x), floor(characterIndex / SIZE.y));
    vec2 offset = vec2(characterPosition.x, -characterPosition.y) / SIZE;
    vec2 charUV = mod(uv * (cell / SIZE), 1.0 / SIZE) - vec2(0., 1.0 / SIZE) + offset;
    vec4 asciiCharacter = texture2D(uCharacters, charUV);

    asciiCharacter.rgb = uColor * asciiCharacter.r;
    asciiCharacter.a = pixelized.a;
    outputColor = asciiCharacter;
}
`;
var Qt = class extends Effect {
  constructor({ font: t = "arial", characters: o = " .:,'-^=*+?!|0#X%WM@", fontSize: r = 54, cellSize: a = 16, color: n = "#ffffff", invert: i = false } = {}) {
    const s = /* @__PURE__ */ new Map([["uCharacters", new Uniform(new Texture())], ["uCellSize", new Uniform(a)], ["uCharactersCount", new Uniform(o.length)], ["uColor", new Uniform(new Color(n))], ["uInvert", new Uniform(i)]]);
    super("ASCIIEffect", Jt, { uniforms: s });
    const l = this.uniforms.get("uCharacters");
    l && (l.value = this.createCharactersTexture(o, t, r));
  }
  createCharactersTexture(t, o, r) {
    const a = document.createElement("canvas"), n = 1024, i = 16, s = n / i;
    a.width = a.height = n;
    const l = new CanvasTexture(a, void 0, RepeatWrapping, RepeatWrapping, NearestFilter, NearestFilter), p2 = a.getContext("2d");
    if (!p2) throw new Error("Context not available");
    p2.clearRect(0, 0, n, n), p2.font = `${r}px ${o}`, p2.textAlign = "center", p2.textBaseline = "middle", p2.fillStyle = "#fff";
    for (let _ = 0; _ < t.length; _++) {
      const S = t[_], g = _ % i, d = Math.floor(_ / i);
      p2.fillText(S, g * s + s / 2, d * s + s / 2);
    }
    return l.needsUpdate = true, l;
  }
};
var eo = (0, import_react.forwardRef)(({ font: e = "arial", characters: t = " .:,'-^=*+?!|0#X%WM@", fontSize: o = 54, cellSize: r = 16, color: a = "#ffffff", invert: n = false }, i) => {
  const s = (0, import_react.useMemo)(() => new Qt({ characters: t, font: e, fontSize: o, cellSize: r, color: a, invert: n }), [t, o, r, a, n, e]);
  return (0, import_jsx_runtime.jsx)("primitive", { ref: i, object: s });
});
var to = { fragmentShader: `
    uniform float factor;

    void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {
      vec2 vUv = uv;
      float frequency = 6.0 * factor;
      float amplitude = 0.015 * factor;
      float x = vUv.y * frequency + time * 0.7; 
      float y = vUv.x * frequency + time * 0.3;
      vUv.x += cos(x + y) * amplitude * cos(y);
      vUv.y += sin(x - y) * amplitude * cos(y);
      vec4 rgba = texture(inputBuffer, vUv);
      outputColor = rgba;
    }
  ` };
var de = class extends Effect {
  constructor({ blendFunction: t = 23, factor: o = 0 } = {}) {
    super("WaterEffect", to.fragmentShader, { blendFunction: t, attributes: 2, uniforms: /* @__PURE__ */ new Map([["factor", new Uniform(o)]]) });
  }
};
var oo = P2(de, { blendFunction: 23 });
var ao = (0, import_react.forwardRef)(({ halfRes: e, screenSpaceRadius: t, quality: o, depthAwareUpsampling: r = true, aoRadius: a = 5, aoSamples: n = 16, denoiseSamples: i = 4, denoiseRadius: s = 12, distanceFalloff: l = 1, intensity: p2 = 1, color: _, renderMode: S = 0 }, g) => {
  const { camera: d, scene: m2 } = useThree(), v3 = (0, import_react.useMemo)(() => new $87431ee93b037844$export$2489f9981ab0fa82(m2, d), [d, m2]);
  return (0, import_react.useLayoutEffect)(() => {
    applyProps(v3.configuration, { color: _, aoRadius: a, distanceFalloff: l, intensity: p2, aoSamples: n, denoiseSamples: i, denoiseRadius: s, screenSpaceRadius: t, renderMode: S, halfRes: e, depthAwareUpsampling: r });
  }, [t, _, a, l, p2, n, i, s, S, e, r, v3]), (0, import_react.useLayoutEffect)(() => {
    o && v3.setQualityMode(o.charAt(0).toUpperCase() + o.slice(1));
  }, [v3, o]), (0, import_jsx_runtime.jsx)("primitive", { ref: g, object: v3 });
});
export {
  eo as ASCII,
  ht as Autofocus,
  wt as Bloom,
  St as BrightnessContrast,
  yt as ChromaticAberration,
  Pt as ColorAverage,
  bt as ColorDepth,
  Et as Depth,
  ce as DepthOfField,
  Rt as DotScreen,
  dt as EffectComposer,
  D as EffectComposerContext,
  Nt as FXAA,
  Ut as Glitch,
  Ct as GodRays,
  zt as Grid,
  Tt as HueSaturation,
  Zt as LUT,
  gt as LensFlare,
  fe as LensFlareEffect,
  ao as N8AO,
  At as Noise,
  Bt as Outline,
  Vt as Pixelation,
  Ot as Ramp,
  pe as RampEffect,
  ue as RampType,
  Lt as SMAA,
  It as SSAO,
  Ft as Scanline,
  mt as Select,
  pt as Selection,
  kt as SelectiveBloom,
  Gt as Sepia,
  Ht as ShockWave,
  Wt as Texture,
  $t as TiltShift,
  Yt as TiltShift2,
  me as TiltShiftEffect,
  Xt as ToneMapping,
  qt2 as Vignette,
  oo as WaterEffect,
  de as WaterEffectImpl,
  k as resolveRef,
  H as selectionContext,
  Z as useVector2,
  P2 as wrapEffect
};
/*! Bundled license information:

postprocessing/build/index.js:
  (**
   * postprocessing v6.37.6 build Fri Jul 04 2025
   * https://github.com/pmndrs/postprocessing
   * Copyright 2015-2025 Raoul van Rüschen
   * @license Zlib
   *)
*/
//# sourceMappingURL=@react-three_postprocessing.js.map
