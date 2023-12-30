out vec2 textureUV;
out vec3 vxNormal;
void main() {
  textureUV = uv;
  vxNormal = normal;

  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.);
}
