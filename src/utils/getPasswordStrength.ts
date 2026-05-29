export type PasswordStrength = {
  score: number;
  label: string;
  barColor?: string;
  textColor?: string;
  className?: string;
};

export const getPasswordStrength = (password: string): PasswordStrength => {
  if (!password) {
    return { score: 0, label: "", barColor: "bg-transparent", textColor: "text-transparent", className: "transparent" };
  }

  const checks = [
    password.length >= 8,
    /[A-Z]/.test(password),
    /[a-z]/.test(password),
    /[0-9]/.test(password),
    /[^A-Za-z0-9]/.test(password),
  ];
  const score = checks.filter(Boolean).length;

  if (score <= 1) return { score: 20, label: "Senha fraca", barColor: "bg-red-500", textColor: "text-red-500", className: "bg-red-800" };
  if (score <= 3) return { score: 50, label: "Senha média", barColor: "bg-amber-500", textColor: "text-amber-500", className: "bg-orange-800"  };
  if (score === 4) return { score: 75, label: "Senha boa", barColor: "bg-teal-500", textColor: "text-teal-500", className: "bg-green-800"  };
  return { score: 100, label: "Senha excelente", barColor: "bg-emerald-500", textColor: "text-emerald-500", className: "bg-emerald-800"};
};
