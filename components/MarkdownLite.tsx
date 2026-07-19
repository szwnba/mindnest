/**
 * MarkdownLite — 一个不依赖任何第三方库的简化 Markdown 渲染器。
 *
 * 支持：
 * - # / ## / ### 标题
 * - 段落（连续非空行）
 * - 无序列表（- / *）与有序列表（1. ）
 * - **粗体** 与 *斜体*
 * - `行内代码`
 * - > 引用
 * - 表格（| col | col |）
 * - 水平分隔线（---）
 *
 * 不支持图片、链接、HTML 内联——这是有意的，资料库正文只用结构化纯文本。
 */

import { Fragment } from "react";

type Inline = string | ReactElement;

function renderInline(text: string, keyBase = ""): Inline[] {
  // 顺序：行内代码 > 粗体 > 斜体
  const out: Inline[] = [];
  let buf = text;
  let i = 0;
  // 用一个迭代式 tokenizer
  while (buf.length > 0) {
    // 行内代码 `...`
    const code = buf.match(/^`([^`]+)`/);
    if (code) {
      out.push(
        <code key={`${keyBase}-c${i++}`} className="md-inline-code">
          {code[1]}
        </code>,
      );
      buf = buf.slice(code[0].length);
      continue;
    }
    // 粗体 **...**
    const bold = buf.match(/^\*\*([^*]+)\*\*/);
    if (bold) {
      out.push(<strong key={`${keyBase}-b${i++}`}>{bold[1]}</strong>);
      buf = buf.slice(bold[0].length);
      continue;
    }
    // 斜体 *...*
    const ital = buf.match(/^\*([^*]+)\*/);
    if (ital) {
      out.push(<em key={`${keyBase}-i${i++}`}>{ital[1]}</em>);
      buf = buf.slice(ital[0].length);
      continue;
    }
    // 普通字符
    const next = buf.search(/[`*]/);
    if (next === -1) {
      out.push(buf);
      buf = "";
    } else {
      out.push(buf.slice(0, next));
      buf = buf.slice(next);
    }
  }
  return out;
}

interface Block {
  type: "h1" | "h2" | "h3" | "p" | "ul" | "ol" | "quote" | "hr" | "table";
  /** 文本类块的行内容；列表的每一项；表格的行数组 */
  items?: string[];
  rows?: string[][];
}

function parse(md: string): Block[] {
  const lines = md.replace(/\r\n/g, "\n").split("\n");
  const blocks: Block[] = [];

  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    const trimmed = line.trim();

    // 空行：跳过
    if (trimmed === "") {
      i++;
      continue;
    }

    // 水平分割线
    if (/^---+$/.test(trimmed)) {
      blocks.push({ type: "hr" });
      i++;
      continue;
    }

    // 标题
    if (trimmed.startsWith("### ")) {
      blocks.push({ type: "h3", items: [trimmed.slice(4)] });
      i++;
      continue;
    }
    if (trimmed.startsWith("## ")) {
      blocks.push({ type: "h2", items: [trimmed.slice(3)] });
      i++;
      continue;
    }
    if (trimmed.startsWith("# ")) {
      blocks.push({ type: "h1", items: [trimmed.slice(2)] });
      i++;
      continue;
    }

    // 引用
    if (trimmed.startsWith("> ")) {
      const items: string[] = [];
      while (i < lines.length && lines[i].trim().startsWith("> ")) {
        items.push(lines[i].trim().slice(2));
        i++;
      }
      blocks.push({ type: "quote", items });
      continue;
    }

    // 无序列表
    if (/^[-*]\s+/.test(trimmed)) {
      const items: string[] = [];
      while (i < lines.length && /^[-*]\s+/.test(lines[i].trim())) {
        items.push(lines[i].trim().replace(/^[-*]\s+/, ""));
        i++;
      }
      blocks.push({ type: "ul", items });
      continue;
    }

    // 有序列表
    if (/^\d+\.\s+/.test(trimmed)) {
      const items: string[] = [];
      while (i < lines.length && /^\d+\.\s+/.test(lines[i].trim())) {
        items.push(lines[i].trim().replace(/^\d+\.\s+/, ""));
        i++;
      }
      blocks.push({ type: "ol", items });
      continue;
    }

    // 表格：包含 | 且下一行是 |---|---|
    if (trimmed.startsWith("|") && i + 1 < lines.length && /^\|?\s*[-:|\s]+\|/.test(lines[i + 1].trim())) {
      const rows: string[][] = [];
      // header
      rows.push(splitTableRow(trimmed));
      i += 2; // 跳过分隔
      while (i < lines.length && lines[i].trim().startsWith("|")) {
        rows.push(splitTableRow(lines[i].trim()));
        i++;
      }
      blocks.push({ type: "table", rows });
      continue;
    }

    // 段落（合并连续非空、非特殊行）
    const para: string[] = [trimmed];
    i++;
    while (
      i < lines.length &&
      lines[i].trim() !== "" &&
      !/^(#{1,3}\s|>\s|[-*]\s|\d+\.\s|---+$|\|)/.test(lines[i].trim())
    ) {
      para.push(lines[i].trim());
      i++;
    }
    blocks.push({ type: "p", items: [para.join(" ")] });
  }

  return blocks;
}

function splitTableRow(line: string): string[] {
  return line
    .replace(/^\|/, "")
    .replace(/\|$/, "")
    .split("|")
    .map((c) => c.trim());
}

export default function MarkdownLite({ source }: { source: string }) {
  const blocks = parse(source);
  return (
    <div className="md-lite">
      {blocks.map((b, idx) => {
        const k = `b-${idx}`;
        switch (b.type) {
          case "h1":
            return <h1 key={k}>{renderInline(b.items![0], k)}</h1>;
          case "h2":
            return <h2 key={k}>{renderInline(b.items![0], k)}</h2>;
          case "h3":
            return <h3 key={k}>{renderInline(b.items![0], k)}</h3>;
          case "p":
            return <p key={k}>{renderInline(b.items![0], k)}</p>;
          case "hr":
            return <hr key={k} />;
          case "quote":
            return (
              <blockquote key={k}>
                {b.items!.map((line, li) => (
                  <Fragment key={`${k}-q${li}`}>
                    {renderInline(line, `${k}-q${li}`)}
                    {li < b.items!.length - 1 ? <br /> : null}
                  </Fragment>
                ))}
              </blockquote>
            );
          case "ul":
            return (
              <ul key={k}>
                {b.items!.map((item, li) => (
                  <li key={`${k}-u${li}`}>{renderInline(item, `${k}-u${li}`)}</li>
                ))}
              </ul>
            );
          case "ol":
            return (
              <ol key={k}>
                {b.items!.map((item, li) => (
                  <li key={`${k}-o${li}`}>{renderInline(item, `${k}-o${li}`)}</li>
                ))}
              </ol>
            );
          case "table":
            return (
              <div key={k} className="md-table-wrap">
                <table className="md-table">
                  <thead>
                    <tr>
                      {b.rows![0].map((c, ci) => (
                        <th key={`${k}-th${ci}`}>{renderInline(c, `${k}-th${ci}`)}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {b.rows!.slice(1).map((row, ri) => (
                      <tr key={`${k}-tr${ri}`}>
                        {row.map((c, ci) => (
                          <td key={`${k}-td${ri}-${ci}`}>
                            {renderInline(c, `${k}-td${ri}-${ci}`)}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
          default:
            return null;
        }
      })}
    </div>
  );
}
