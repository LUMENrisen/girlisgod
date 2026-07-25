// radiance-shader.js
export const vert = `
attribute vec3 aPosition;
attribute vec2 aTexCoord;
varying vec2 vTexCoord;

void main() {
  vTexCoord = aTexCoord;
  vec4 positionVec4 = vec4(aPosition, 1.0);
  // 将坐标从 [0,1] 转换到 [-1,1] (NDC)
  positionVec4.xy = positionVec4.xy * 2.0 - 1.0;
  gl_Position = positionVec4;
}
`;

export const frag = `
precision highp float;

varying vec2 vTexCoord;
uniform vec2 canvasSize;
uniform float time;

// 伪随机函数，用于增加细节
float random(vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
}

void main() {
    // 归一化坐标，让中心在 (0.5, 0.5)
    vec2 uv = vTexCoord;
    vec2 center = vec2(0.5, 0.5);
    vec2 p = uv - center;

    // 距离中心的距离
    float dist = length(p);
    // 角度
    float angle = atan(p.y, p.x);

    // 定义金色系颜色
    vec3 goldLight = vec3(0.95, 0.77, 0.06); // #f1c40f
    vec3 goldMain = vec3(0.83, 0.68, 0.21);  // #d4af37
    vec3 goldDark = vec3(0.72, 0.52, 0.04);  // 深金色

    // 动态时间因子
    float t = time * 0.8;

    // --- 核心“花开”效果：从中心向外扩散的光晕和波纹 ---
    // 1. 基础径向渐变，模拟光晕
    float glow = exp(-dist * 2.5) * 0.8;
    // 增加脉动：中心亮度随时间轻微变化
    float pulse = sin(t * 2.0) * 0.15 + 0.85;
    glow *= pulse;

    // 2. 动态波纹，模拟向外扩散的能量
    // 波纹频率随时间变化，距离中心越远，波纹越密
    float ripple = sin(dist * 12.0 - t * 4.0) * 0.5 + 0.5;
    ripple *= smoothstep(0.8, 0.2, dist); // 远距离波纹减弱

    // 3. 旋转的光线，增加绽放感
    float rays = sin(angle * 8.0 + t) * 0.3 + 0.7;
    rays *= (1.0 - smoothstep(0.3, 0.8, dist));

    // 4. 微弱的噪点，增加质感
    float grain = random(uv + floor(t * 10.0)) * 0.1;

    // 组合效果
    float intensity = glow * 1.2 + ripple * 0.6 + rays * 0.4 + grain;
    // 边缘暗化，聚焦中心
    intensity *= (1.0 - smoothstep(0.3, 1.0, dist));

    // 根据强度和距离混合颜色
    vec3 color = mix(goldDark, goldMain, intensity);
    color = mix(color, goldLight, pow(intensity, 1.5));

    // 最终输出，alpha 固定为1.0
    gl_FragColor = vec4(color, 1.0);
}
`;