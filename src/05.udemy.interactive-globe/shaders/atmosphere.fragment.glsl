uniform vec3 sunDirection;
uniform vec3 atmosphereColor;

in vec2 textureUV;
in vec3 vxNormal;

void main() {
  float intencity = pow((0.4 - dot(vxNormal, sunDirection)), 2.);

  vec3 atmosphere = mix(vec3(0., 0., 0.), atmosphereColor, intencity);

  gl_FragColor = vec4(atmosphere, 1.);
}
