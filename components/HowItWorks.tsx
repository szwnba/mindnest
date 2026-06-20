export default function HowItWorks() {
  return (
    <section className="section" id="how" aria-labelledby="how-title">
      <div className="section-inner">
        <div className="section-header center reveal">
          <div
            className="section-eyebrow"
            style={{ justifyContent: "center" }}
          >
            <div className="section-eyebrow-dot" aria-hidden="true" />
            <span className="tag tag--warm">使用指南</span>
          </div>
          <h2 className="section-title" id="how-title">
            三步开启自我认知
          </h2>
          <p
            className="section-subtitle"
            style={{ marginLeft: "auto", marginRight: "auto" }}
          >
            简单、温和、有深度。不需要心理学背景，只需要你真诚地面对自己。
          </p>
        </div>

        <div className="steps-grid">
          <div className="step-card reveal">
            <div className="step-number">1</div>
            <h3 className="step-title">回答问题</h3>
            <p className="step-desc">
              在安静的环境下，根据直觉对每条陈述选择 1-5 分的同意度。没有标准答案，真实最重要。
            </p>
          </div>
          <div className="step-card reveal reveal-d1">
            <div className="step-number">2</div>
            <h3 className="step-title">获取报告</h3>
            <p className="step-desc">
              系统将从 4 个核心维度计算你的偏好分布，生成包含类型描述、优势分析与成长建议的个人报告。
            </p>
          </div>
          <div className="step-card reveal reveal-d2">
            <div className="step-number">3</div>
            <h3 className="step-title">深入探索</h3>
            <p className="step-desc">
              浏览 16 种人格类型详情与资料库，将自我认知转化为日常生活中的实际行动。
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
