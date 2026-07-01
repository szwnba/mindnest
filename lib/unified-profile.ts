import {
  HEXACO_RESULT_STORAGE_KEY,
  decodeHexacoFromUrl,
  type HexacoResult,
} from "./hexaco-scoring";
import {
  BFI10_RESULT_STORAGE_KEY,
  decodeBFI10FromUrl,
  type BFI10Result,
} from "./bfi10-scoring";
import type { QuizResult } from "./scoring";

export type TestFramework = "hexaco" | "bfi10" | "mbti";

export interface UnifiedProfile {
  hexaco: {
    completed: boolean;
    result: HexacoResult | null;
    inProgress: boolean;
  };
  bfi10: {
    completed: boolean;
    result: BFI10Result | null;
    inProgress: boolean;
  };
  mbti: {
    completed: boolean;
    result: QuizResult | null;
    inProgress: boolean;
  };
  totalCompleted: number;
}

export function readUnifiedProfile(): UnifiedProfile {
  if (typeof window === "undefined") {
    return emptyProfile();
  }

  // HEXACO (URL-encoded in sessionStorage)
  let hexacoResult: HexacoResult | null = null;
  let hexacoInProgress = false;
  try {
    const r = window.sessionStorage.getItem(HEXACO_RESULT_STORAGE_KEY);
    const a = window.sessionStorage.getItem("mindnest:hexaco-answers-v1");
    if (r) {
      const decoded = decodeHexacoFromUrl(r);
      if (decoded) {
        hexacoResult = {
          H: decoded.H, E: decoded.E, X: decoded.X,
          A: decoded.A, C: decoded.C, O: decoded.O,
          profile: {
            H: lvl(decoded.H), E: lvl(decoded.E), X: lvl(decoded.X),
            A: lvl(decoded.A), C: lvl(decoded.C), O: lvl(decoded.O),
          },
          computedAt: Date.now(),
        };
      }
    } else if (a) {
      hexacoInProgress = Object.keys(JSON.parse(a)).length > 0;
    }
  } catch { /* ignore */ }

  // BFI10 (URL-encoded)
  let bfi10Result: BFI10Result | null = null;
  let bfi10InProgress = false;
  try {
    const r = window.sessionStorage.getItem(BFI10_RESULT_STORAGE_KEY);
    const a = window.sessionStorage.getItem("mindnest:bfi10-answers-v1");
    if (r) {
      const decoded = decodeBFI10FromUrl(r);
      if (decoded) {
        bfi10Result = {
          O: decoded.O, C: decoded.C, E: decoded.E,
          A: decoded.A, N: decoded.N,
          profile: {
            O: lvl(decoded.O), C: lvl(decoded.C), E: lvl(decoded.E),
            A: lvl(decoded.A), N: lvl(decoded.N),
          },
          computedAt: Date.now(),
        };
      }
    } else if (a) {
      bfi10InProgress = Object.keys(JSON.parse(a)).length > 0;
    }
  } catch { /* ignore */ }

  // MBTI (JSON directly)
  let mbtiResult: QuizResult | null = null;
  let mbtiInProgress = false;
  try {
    const r = window.sessionStorage.getItem("mindnest:quiz-result-v1");
    const a = window.sessionStorage.getItem("mindnest:quiz-answers-v1");
    if (r) {
      mbtiResult = JSON.parse(r) as QuizResult;
    } else if (a) {
      mbtiInProgress = Object.keys(JSON.parse(a)).length > 0;
    }
  } catch { /* ignore */ }

  const totalCompleted = [hexacoResult, bfi10Result, mbtiResult].filter(Boolean).length;

  return {
    hexaco: { completed: !!hexacoResult, result: hexacoResult, inProgress: hexacoInProgress },
    bfi10: { completed: !!bfi10Result, result: bfi10Result, inProgress: bfi10InProgress },
    mbti: { completed: !!mbtiResult, result: mbtiResult, inProgress: mbtiInProgress },
    totalCompleted,
  };
}

function lvl(pct: number): "高" | "中" | "低" {
  if (pct < 40) return "低";
  if (pct > 60) return "高";
  return "中";
}

function emptyProfile(): UnifiedProfile {
  return {
    hexaco: { completed: false, result: null, inProgress: false },
    bfi10: { completed: false, result: null, inProgress: false },
    mbti: { completed: false, result: null, inProgress: false },
    totalCompleted: 0,
  };
}

export const TEST_META = {
  hexaco: {
    name: "HEXACO 六维模型",
    shortName: "HEXACO",
    icon: "🔬",
    route: "/hexaco",
    color: "--sage",
    dimensions: 6,
  },
  bfi10: {
    name: "大五人格 BFI-10",
    shortName: "Big Five",
    icon: "🌊",
    route: "/bfi10",
    color: "--terracotta",
    dimensions: 5,
  },
  mbti: {
    name: "MBTI 十六型",
    shortName: "MBTI",
    icon: "🧭",
    route: "/#quiz",
    color: "--gold",
    dimensions: 4,
  },
};
