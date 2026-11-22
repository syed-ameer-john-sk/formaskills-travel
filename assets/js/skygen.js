/* Formaskills Travel — procedural sky & cloud generator (WebGL, runs once at load).
   Renders, at the device's exact resolution:
   - a "sea of clouds" seen from cruising altitude: perspective cloud deck with domain-warped
     fBm, directional light from a high cool sun, ambient occlusion in the gaps, atmospheric
     perspective to a misty horizon, and a clean sky with faint high cirrus;
   - soft, detailed cloud puffs (transparent sprites) for the fly-through descent.
   Output is a static image / canvases — nothing runs per frame. No golden tones, no glow. */
(() => {
  const VERT = 'attribute vec2 p;varying vec2 vUv;void main(){vUv=p*.5+.5;gl_Position=vec4(p,0.,1.);}';
  const FRAG = `
precision highp float;
uniform vec2 uRes; uniform float uSeed; uniform float uMode;
varying vec2 vUv;
float hash(vec2 p){ p=fract(p*vec2(233.34,851.73)); p+=dot(p,p+23.45+uSeed); return fract(p.x*p.y); }
float noise(vec2 p){ vec2 i=floor(p), f=fract(p); vec2 u=f*f*f*(f*(f*6.-15.)+10.);
  float a=hash(i), b=hash(i+vec2(1.,0.)), c=hash(i+vec2(0.,1.)), d=hash(i+vec2(1.,1.));
  return mix(mix(a,b,u.x),mix(c,d,u.x),u.y); }
const mat2 R=mat2(1.6,1.2,-1.2,1.6);
float fbm(vec2 p){ float v=0., a=.5; for(int i=0;i<7;i++){ v+=a*noise(p); p=R*p; a*=.5; } return v; }
float fbm4(vec2 p){ float v=0., a=.5; for(int i=0;i<4;i++){ v+=a*noise(p); p=R*p; a*=.5; } return v; }

vec3 SKY_TOP=vec3(.09,.16,.33), SKY_HZ=vec3(.79,.84,.91), LIT=vec3(.975,.982,.995), SHADE=vec3(.50,.57,.70), GAP=vec3(.22,.29,.44);

// Worley cells → rounded cumulus domes (1 at a dome centre, 0 at the seams)
vec2 h2(vec2 p){ return vec2(hash(p), hash(p+19.19)); }
float domes(vec2 p){
  vec2 i=floor(p), f=fract(p); float d=8.;
  for(int y=-1;y<=1;y++) for(int x=-1;x<=1;x++){
    vec2 g=vec2(float(x),float(y)); vec2 o=h2(i+g)*.85+.075;
    vec2 r=g+o-f; d=min(d,dot(r,r));
  }
  return 1.-sqrt(d);
}
// cloud-deck height field: big domes, medium tufts, fine cauliflower detail
float height(vec2 q){
  float w=fbm4(q*.18)*1.6;
  return domes(q*.42+w)*.55 + domes(q*1.05+w*.5)*.28 + fbm4(q*2.6)*.22;
}

vec3 sea(vec2 uv){
  float aspect=uRes.x/uRes.y, hz=.64;
  if(uv.y>hz){
    float t=(uv.y-hz)/(1.-hz);
    vec3 c=mix(SKY_HZ,SKY_TOP,pow(t,.75));
    float ci=fbm4(vec2(uv.x*aspect*1.6+uSeed, uv.y*16.));
    c=mix(c,vec3(.94,.96,.99),smoothstep(.56,.86,ci)*.24*(1.-t*.8));
    return c;
  }
  float d=hz-uv.y;
  float z=.3/(d+.002);
  vec2 q=vec2((uv.x-.5)*aspect*z, z)*1.15+uSeed*7.;
  float h=height(q);
  // surface normal from the height field (world space) and a high, cool sun
  float e=.035*(1.+z*.08);
  float hx=height(q+vec2(e,0.)), hz2=height(q+vec2(0.,e));
  vec3 n=normalize(vec3((h-hx)*2.4/e*.04, 1., (h-hz2)*2.4/e*.04));
  vec3 L=normalize(vec3(-.45,.75,.5));
  float diff=clamp(dot(n,L),0.,1.);
  float cover=smoothstep(.3,.52,h);                        // gaps between clouds
  vec3 col=mix(SHADE,LIT,pow(diff,.9));
  col=mix(col,LIT,smoothstep(.72,.95,h)*.3);               // sunlit dome crowns
  col*=.8+.2*smoothstep(.35,.85,h);                        // occlusion in the creases
  col=mix(GAP,col,cover);
  float fog=1.-exp(-z*.05);
  col=mix(col,SKY_HZ,clamp(fog,0.,1.));
  return col;
}

vec4 puff(vec2 uv){
  vec2 p=(uv-.5)*vec2(2.,2.2);
  float n=fbm4(uv*vec2(3.2,2.2)+uSeed*3.1);
  float bumps=domes(uv*vec2(5.,3.4)+uSeed);
  float r=length(p*vec2(1.,1.35+.3*step(0.,-p.y)));
  float shape=smoothstep(1.,.35, r+(n-.5)*.9-(bumps-.5)*.35);
  shape*=smoothstep(-.95,-.45,p.y+(n-.5)*.4);              // flatter base
  float light=clamp(.55+p.y*.45+(bumps-.5)*.5+(n-.5)*.3,0.,1.);
  vec3 col=mix(vec3(.62,.68,.80),vec3(1.),light);
  return vec4(col*shape,shape);
}

void main(){
  vec2 uv=vUv;
  float g=(hash(gl_FragCoord.xy+17.)-.5)/255.;              // dither: no banding
  if(uMode<.5){ gl_FragColor=vec4(sea(uv)+g,1.); }
  else { vec4 c=puff(uv); gl_FragColor=vec4(c.rgb+g*c.a,c.a); }
}`;

  let gl = null, prog = null, canvas = null;
  function init() {
    if (gl) return gl;
    canvas = document.createElement('canvas');
    gl = canvas.getContext('webgl', { preserveDrawingBuffer: true, premultipliedAlpha: true, antialias: false });
    if (!gl) return null;
    const sh = (type, src) => { const s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s); if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s)); return s; };
    prog = gl.createProgram();
    gl.attachShader(prog, sh(gl.VERTEX_SHADER, VERT)); gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(prog); if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) throw new Error('link');
    gl.useProgram(prog);
    const buf = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, 'p'); gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    return gl;
  }
  function draw(w, h, mode, seed) {
    canvas.width = w; canvas.height = h; gl.viewport(0, 0, w, h);
    gl.uniform2f(gl.getUniformLocation(prog, 'uRes'), w, h);
    gl.uniform1f(gl.getUniformLocation(prog, 'uSeed'), seed);
    gl.uniform1f(gl.getUniformLocation(prog, 'uMode'), mode);
    gl.clearColor(0, 0, 0, 0); gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  }
  function release() {
    try { gl?.getExtension('WEBGL_lose_context')?.loseContext(); } catch {}
    gl = null; prog = null; canvas = null;
  }

  window.FSSky = {
    /** Render the cloud sea at w×h device pixels. Resolves to an object URL (JPEG) or null. */
    sea(w, h, seed = 3.7) {
      return new Promise((resolve) => {
        try {
          if (!init()) return resolve(null);
          const max = Math.min(gl.getParameter(gl.MAX_RENDERBUFFER_SIZE), gl.getParameter(gl.MAX_VIEWPORT_DIMS)[0], 4096);
          const k = Math.min(1, max / Math.max(w, h));
          draw(Math.round(w * k), Math.round(h * k), 0, seed);
          canvas.toBlob((b) => resolve(b ? URL.createObjectURL(b) : null), 'image/jpeg', .94);
        } catch { resolve(null); }
      });
    },
    /** Render n transparent cloud puffs as 2D canvases (w×h each). */
    puffs(n = 4, w = 640, h = 400) {
      try {
        if (!init()) return null;
        const out = [];
        for (let i = 0; i < n; i++) {
          draw(w, h, 1, 1.3 + i * 2.17);
          const c = document.createElement('canvas'); c.width = w; c.height = h;
          c.getContext('2d').drawImage(canvas, 0, 0); out.push(c);
        }
        return out;
      } catch { return null; }
    },
    release,
  };
})();
