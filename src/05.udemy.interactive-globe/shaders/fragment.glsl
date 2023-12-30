uniform sampler2D globeTexture;
uniform vec3 sunDirection;

in vec2 textureUV;
in vec3 vxNormal;

void main() {
//  gl_FragColor = vec4(1., 0., 0., 1.);
  float intencity = 1.05 - dot(vxNormal, sunDirection);
  vec3 atmosphere = vec3(.3, .6, 1.) * pow(intencity, 1.5);

  vec4 color = vec4(atmosphere, 1.) + texture(globeTexture, textureUV);
  gl_FragColor = color;
//  gl_FragColor = texture(globeTexture, textureUV);
}
