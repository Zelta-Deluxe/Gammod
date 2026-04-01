#pragma header

uniform float mask_softness;
uniform float mask_threshold;
uniform float sort;
uniform float alpha;

void main()
{
    vec2 uv = openfl_TextureCoordv;

    vec4 tex = texture2D(bitmap, uv);

    // Masking
    float f = mask_softness / 2.0;
    float a = mask_threshold - f;
    float b = mask_threshold + f;

    float average = (tex.r + tex.g + tex.b) / 3.0;
    float mask = smoothstep(a, b, average);

    // Pseudo Pixel Sorting
    float sort_threshold = 1.0 - clamp(sort / 2.6, 0.0, 1.0);
    vec2 sort_uv = vec2(uv.x, sort_threshold);

    // Curved melting transition
    vec2 transition_uv = uv;

    float turbulence = fract(
        sin(dot(vec2(transition_uv.x, uv.y), vec2(12.9, 78.2))) * 437.5
    );

    transition_uv.y += pow(sort, 2.0 + (sort * 2.0)) * mask * turbulence;

    vec4 color;

    if (transition_uv.y > 1.0)
        color = texture2D(bitmap, sort_uv);
    else
        color = texture2D(bitmap, uv);
	  
	 
	color.a *= alpha;

    gl_FragColor = color;
}