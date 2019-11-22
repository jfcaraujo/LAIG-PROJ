#ifdef GL_ES
precision highp float;
#endif

varying vec2 vTextureCoord;
uniform sampler2D uSampler;

void main() {
	float y = vTextureCoord.y;
	if ((y<0.1 && y>0.0) || (y>0.5 && y<0.6))
		gl_FragColor =  vec4(1.0,1.0,1.0, 1.0);
	else
		gl_FragColor =  texture2D(uSampler, vTextureCoord);
}


