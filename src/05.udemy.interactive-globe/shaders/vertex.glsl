out vec2 textureUV;
out vec3 vxNormal;
void main() {
  textureUV = uv;
  vxNormal = normalize(normalMatrix * normal);

  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.);
}
