import { memo } from "react";

const PrivacyPolicy = memo(() => {
  return (
    <div
      style={{
        padding: 20,
        maxWidth: 800,
        margin: "auto",
        lineHeight: 1.8,
        fontSize: 20,
      }}
    >
      <h1>隐私政策</h1>
      <p>欢迎来到 MIT NuGet Next 开源项目的隐私政策页面。</p>
      <p>您的隐私对我们至关重要。我们有一些基本原则：</p>
      <ul>
        <li>除非我们确实需要，否则我们不会向您索取个人信息。</li>
        <li>除非遵守法律要求，否则我们不会分享您的个人信息。</li>
        <li>除非为了我们服务的持续运营所需，否则我们不会在服务器上存储个人信息。</li>
      </ul>
      <p>如果您有关于删除或更正您的个人数据的问题，请联系我们的支持团队。</p>
    </div>
  );
});

PrivacyPolicy.displayName = "PrivacyPolicy";

export default PrivacyPolicy;
