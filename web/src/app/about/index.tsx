import { memo } from "react";

const AboutPage = memo(() => {
  return (
    <div
      style={{
        padding: "20px",
        maxWidth: "800px",
        margin: "0 auto",
        lineHeight: "1.5",
        fontSize: "20px",
      }}
    >
      <h1>关于NuGet Next</h1>
      <p>NuGet Next是新一代的NuGet包管理器，旨在为管理。net包提供更高效和用户友好的体验。</p>
      <ul>
        <li>更好的性能</li>
        <li>更安全的功能</li>
        <li>于现代开发工作流更好的集成</li>
        <li>前面的文档和支持</li>
      </ul>
    </div>
  );
});

export default AboutPage;
