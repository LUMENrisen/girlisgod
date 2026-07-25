// 片段着色器：花开（Radiance）效果
precision highp float;

varying vec2 vTexCoord;
uniform vec2 resolution;
uniform float time;

// 伪随机函数
float random(vec2 st) {
  return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
}

void main() {
  // 将坐标归一化到 [0,1]，并让中心在 (0.5, 0.5)
  vec2 uv = vTexCoord;
  vec2 center = vec2(0.5, 0.5);
  vec2 p = uv - center;
  
  // 距离中心的距离
  float dist = length(p);
  
  // 基础金色：色相约50°，饱和度20-30，亮度随距离变化
  // 这里用RGB直接模拟金色
  vec3 gold1 = vec3(0.83, 0.68, 0.21); // #d4af37
  vec3 gold2 = vec3(0.95, 0.77, 0.06); // #f1c40f
  
  // 时间因子，用于脉动
  float t = time * 1.5;
  
  // 径向渐变：中心亮，向外渐暗
  float brightness = 1.0 - smoothstep(0.0, 0.8, dist);
  
  // 增加脉动：中心光晕半径随sin变化
  float pulse = sin(t * 2.0) * 0.3 + 0.7;
  float glow = exp(-dist * 3.0 * pulse) * 0.8;
  
  // 模拟光线向外扩散的条纹：利用角度产生旋转感
  float angle = atan(p.y, p.x);
  float stripe = sin(angle * 8.0 + t * 5.0) * 0.1;
  
  // 叠加一些粒子状的噪点，模拟光点
  float grain = random(uv + floor(time * 10.0)) * 0.1;
  
  // 最终颜色：混合金色，亮度由以上因素组合
  vec3 color = mix(gold1, gold2, brightness);
  color *= (glow + brightness * 0.5 + stripe + grain);
  
  // 边缘暗化
  color *= (1.0 - smoothstep(0.5, 1.0, dist));
  
  gl_FragColor = vec4(color, 1.0);
}