import { BarChart3, Menu, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-blue-600 to-blue-700">
              <BarChart3 size={24} className="text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900">TCC Fornecedores</h1>
              <p className="text-xs text-slate-500">Sistema de Avaliação</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <a href="#" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition">
              Dashboard
            </a>
            <a href="#" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition">
              Fornecedores
            </a>
            <a href="#" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition">
              Relatórios
            </a>
            <a href="#" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition">
              Sobre
            </a>
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X size={24} className="text-slate-900" />
            ) : (
              <Menu size={24} className="text-slate-900" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="md:hidden pb-4 space-y-2">
            <a href="#" className="block px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded">
              Dashboard
            </a>
            <a href="#" className="block px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded">
              Fornecedores
            </a>
            <a href="#" className="block px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded">
              Relatórios
            </a>
            <a href="#" className="block px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded">
              Sobre
            </a>
          </nav>
        )}
      </div>
    </header>
  );
}
