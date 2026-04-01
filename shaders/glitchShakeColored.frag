// Glitch Effect Shader - converted from Godot (MIT License, original by Yui Kinomoto @arlez80)
// HaxeFlixel / OpenFL compatible GLSL fragment shader

#pragma header

// Uniforms
uniform float shake_power; // 0.06
uniform float shake_rate; // 0.2
uniform float shake_speed; // 5.0
uniform float shake_block_size; // 30.5
uniform float shake_color_rate; // 0.01
uniform float uTime;

// NEW: color tint (RGBA)
uniform vec4 tintColor;

float random(float seed)
{
    return fract(543.2543 * sin(dot(vec2(seed, seed), vec2(3525.46, -54.3415))));
}

float trunc(float x) {
    return sign(x) * floor(abs(x));
}

void main()
{
    vec2 uv = openfl_TextureCoordv;

    float enable_shift = float(
        random(trunc(uTime * shake_speed)) < shake_rate
    );

    vec2 fixed_uv = uv;
    fixed_uv.x += (
        random(
            (trunc(uv.y * shake_block_size) / shake_block_size)
            + uTime
        ) - 0.5
    ) * shake_power * enable_shift;

    // SAMPLE BASE COLOR
    vec4 pixel_color = texture2D(bitmap, fixed_uv);

    // APPLY TINT BEFORE EFFECTS
    pixel_color *= tintColor;

    // RGB glitch
    pixel_color.r = mix(
        pixel_color.r,
        texture2D(bitmap, fixed_uv + vec2(shake_color_rate, 0.0)).r * tintColor.r,
        enable_shift
    );

    pixel_color.b = mix(
        pixel_color.b,
        texture2D(bitmap, fixed_uv + vec2(-shake_color_rate, 0.0)).b * tintColor.b,
        enable_shift
    );

    gl_FragColor = pixel_color;
}