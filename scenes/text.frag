#ifdef GL_ES
precision highp float;
#endif

varying vec2 vTextureCoord;
uniform sampler2D uSampler;
uniform float timeFactor;

void main() {
	vec4 color = texture2D(uSampler, vTextureCoord);
	float x = vTextureCoord.x;
	float y = vTextureCoord.y;
	float dist = sqrt( (abs(0.5-x)*abs(0.5-x)) + (abs(0.5-y)*abs(0.5-y)));//distancia ate ao centro
	float gradient = 1.0-dist/0.71;
	color = vec4(color.rgb * gradient,1.0);
	float offset = 2.0* timeFactor/1000.0;

	if (mod(y * 10.0-offset, 3.0) > 2.0)
		gl_FragColor = vec4(1.0,1.0,1.0,1.0);//barra branca
	else
		gl_FragColor =  color;
}