#ifdef GL_ES
precision highp float;
#endif

varying vec2 vTextureCoord;
uniform sampler2D uSampler;
uniform float timeFactor;

void main() {//TODO add gradiente
	float y = vTextureCoord.y;
	float offset = 0.4 * timeFactor/1000.0;
	float interval1_low = mod(0.0 + offset,1.0);
	float interval1_high = mod(0.1 + offset,1.0);
	float interval2_low = mod(0.5 + offset,1.0);
	float interval2_high = mod(0.6 + offset,1.0);

	if (y < interval1_high && y > interval1_low)
		gl_FragColor =  vec4(1.0,1.0,1.0, 1.0);
	else if (interval1_high < interval1_low && (y < interval1_high || y > interval1_low))
		gl_FragColor =  vec4(1.0,1.0,1.0, 1.0);
	else if (y < interval2_high && y > interval2_low)
		gl_FragColor =  vec4(1.0,1.0,1.0, 1.0);
	else if (interval2_high < interval2_low && (y < interval2_high || y > interval2_low))
		gl_FragColor =  vec4(1.0,1.0,1.0, 1.0);
	else
		gl_FragColor =  texture2D(uSampler, vTextureCoord);
}