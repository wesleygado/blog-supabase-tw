import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 flex items-center justify-center">
      <div className="text-center max-w-md px-6">
        <h1 className="text-6xl font-bold text-slate-900 dark:text-white mb-4">
          404
        </h1>
        <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-4">
          Post não encontrado
        </h2>
        <p className="text-slate-600 dark:text-slate-400 mb-8">
          O post que você está procurando não existe ou foi removido.
        </p>
        <Link 
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar ao blog
        </Link>
      </div>
    </div>
  );
}
