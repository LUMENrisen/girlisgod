// 片元着色器：实现金色透明的花开效果
#ifdef GL_ES
precision mediump float;
#endif

varying vec2 vTexCoord;
uniform vec2 iResolution;
uniform float iTime;

void main() {
    // 将坐标归一化到 [0,1] 区间
    vec2 uv = vTexCoord;
    
    // 让中心点稍微偏上一些，更符合视觉重心
    vec2 center = vec2(0.5, 0.65);
    
    // 计算当前像素到中心的距离
    vec2 delta = uv - center;
    float dist = length(delta);
    
    // 根据距离计算基础亮度：中心最亮，向外衰减
    float brightness = 1.0 - smoothstep(0.1, 0.8, dist);
    
    // 用正弦波制造脉动效果
    float pulse = sin(iTime * 1.5 + dist * 10.0) * 0.3 + 0.7;
    
    // 花瓣状的光晕：用角度制造不均匀性
    float angle = atan(delta.y, delta.x);
    float petal = sin(angle * 5.0 + iTime) * 0.2 + 0.8;
    
    // 组合最终亮度
    float finalBrightness = brightness * pulse * petal;
    
    // 金色色相：HSB中黄色/金色大约在45-60度
    // 这里用RGB直接调出金色：R和G为主，B少量
    vec3 goldColor = vec3(1.0, 0.85, 0.4); // 基础金色
    
    // 根据亮度调整颜色，亮部更黄，暗部更暖
    vec3 color = goldColor * finalBrightness;
    
    // 透明度：中心不透明，边缘透明
    float alpha = finalBrightness * 0.8;
    
    // 最终输出，背景保持黑色（用户背景是深色）
    gl_FragColor = vec4(color, alpha);
}