uniform sampler2D globeTexture;
uniform vec3 sunDirection;
uniform vec3 atmosphereColor;

in vec2 textureUV;
in vec3 vxNormal;

void main() {
//  gl_FragColor = vec4(1., 0., 0., 1.);
  float intencity = pow((1.05 - dot(vxNormal, sunDirection)), 1.5);
  vec3 atmosphere = mix(vec3(0., 0., 0.), atmosphereColor, intencity);

  vec4 color = vec4(atmosphere, 1.) + texture(globeTexture, textureUV);
  gl_FragColor = color;
//  gl_FragColor = texture(globeTexture, textureUV);
}
