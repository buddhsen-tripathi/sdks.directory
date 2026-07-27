import type { LanguageMeta } from "../types/catalog";

export const languages: LanguageMeta[] = [
  { id: "python", name: "Python", shortName: "Py", color: "#3776AB" },
  {
    id: "javascript",
    name: "JavaScript",
    shortName: "JS",
    color: "#F7DF1E",
    aliases: ["js"],
  },
  {
    id: "typescript",
    name: "TypeScript",
    shortName: "TS",
    color: "#3178C6",
    aliases: ["ts"],
  },
  {
    id: "nodejs",
    name: "Node.js",
    shortName: "Node",
    color: "#5FA04E",
    aliases: ["node", "nodejs"],
  },
  { id: "go", name: "Go", shortName: "Go", color: "#00ADD8" },
  { id: "rust", name: "Rust", shortName: "Rs", color: "#DEA584" },
  { id: "java", name: "Java", shortName: "Java", color: "#ED8B00" },
  { id: "kotlin", name: "Kotlin", shortName: "Kt", color: "#7F52FF" },
  { id: "swift", name: "Swift", shortName: "Swift", color: "#F05138" },
  { id: "ruby", name: "Ruby", shortName: "Rb", color: "#CC342D" },
  { id: "php", name: "PHP", shortName: "PHP", color: "#777BB4" },
  {
    id: "csharp",
    name: "C#",
    shortName: "C#",
    color: "#512BD4",
    aliases: ["dotnet", ".net"],
  },
  { id: "dart", name: "Dart", shortName: "Dart", color: "#0175C2" },
  { id: "cpp", name: "C++", shortName: "C++", color: "#00599C" },
  { id: "c", name: "C", shortName: "C", color: "#A8B9CC" },
  { id: "scala", name: "Scala", shortName: "Scala", color: "#DC322F" },
  { id: "elixir", name: "Elixir", shortName: "Ex", color: "#4B275F" },
  { id: "shell", name: "Shell", shortName: "Sh", color: "#4EAA25" },
];

export function getLanguage(id: string): LanguageMeta | undefined {
  return languages.find(
    (lang) =>
      lang.id === id ||
      lang.aliases?.includes(id) ||
      lang.shortName.toLowerCase() === id.toLowerCase(),
  );
}
