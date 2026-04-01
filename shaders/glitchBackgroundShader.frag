#pragma header

uniform float uTime;

uniform vec3 uColorA;
uniform vec3 uColorB;
uniform float uIntro;

float liquidness = 20.0;
float smoothness = 1.5;

// Smooth value noise
float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);

    float a = fract(sin(dot(i, vec2(127.1, 311.7))) * 43758.5453);
    float b = fract(sin(dot(i + vec2(1.0, 0.0), vec2(127.1, 311.7))) * 43758.5453);
    float c = fract(sin(dot(i + vec2(0.0, 1.0), vec2(127.1, 311.7))) * 43758.5453);
    float d = fract(sin(dot(i + vec2(1.0, 1.0), vec2(127.1, 311.7))) * 43758.5453);

    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(a, b, u.x)
         + (c - a) * u.y * (1.0 - u.x)
         + (d - b) * u.x * u.y;
}

// Fractal field (low frequency dominant)
float fbm(vec2 p) {
    float v = 0.0;
    float a = 0.5;
    for (int i = 0; i < 4; i++) {
        v += a * noise(p);
        p *= 2.0;
        a *= 0.5;
    }
    return v;
}

void main() {
    vec2 uv = openfl_TextureCoordv;

    // --- FLOW FIELD ---
    vec2 flow = vec2(
        fbm(uv * liquidness + vec2(0.0, uTime * 0.1)),
        fbm(uv * liquidness + vec2(uTime * 0.1, 0.0))
    );

    // --- DOMAIN WARPING (THIS IS THE LIQUID) ---
    vec2 warpedUV = uv + (flow - 0.5);

    // --- SURFACE FIELD ---
    float surface = fbm(warpedUV * 3.0 * uIntro - uTime * 0.2);

    // --- SHAPE COMPRESSION ---
    surface = smoothstep(0.38 * smoothness, 0.39 * smoothness, surface);

    // --- COLOR ---
    vec3 colorPix = mix(uColorA, uColorB, surface);
    vec4 color = flixel_texture2D(bitmap, openfl_TextureCoordv);

    if (color.a > 0.0)
    {
	gl_FragColor = vec4(colorPix.r, colorPix.g, colorPix.b, color.a);
    }
    else
    {
	gl_FragColor = vec4(0.0, 0.0, 0.0, 0.0);
	}
}
