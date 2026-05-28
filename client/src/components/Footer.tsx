export default function Footer() {
  return (
    <footer className="w-full border-t border-slate-200 bg-slate-50 py-8 md:py-12">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          {/* About */}
          <div>
            <h3 className="font-semibold text-slate-900 mb-4">TCC Fornecedores</h3>
            <p className="text-sm text-slate-600">
              Sistema inteligente de avaliação e gestão de fornecedores baseado em critérios objetivos.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold text-slate-900 mb-4">Produto</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="text-slate-600 hover:text-slate-900">Dashboard</a></li>
              <li><a href="#" className="text-slate-600 hover:text-slate-900">Relatórios</a></li>
              <li><a href="#" className="text-slate-600 hover:text-slate-900">API</a></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-semibold text-slate-900 mb-4">Recursos</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="text-slate-600 hover:text-slate-900">Documentação</a></li>
              <li><a href="#" className="text-slate-600 hover:text-slate-900">Guia de Uso</a></li>
              <li><a href="#" className="text-slate-600 hover:text-slate-900">FAQ</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-slate-900 mb-4">Contato</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="mailto:contato@tcc.com" className="text-slate-600 hover:text-slate-900">contato@tcc.com</a></li>
              <li><a href="#" className="text-slate-600 hover:text-slate-900">GitHub</a></li>
              <li><a href="#" className="text-slate-600 hover:text-slate-900">LinkedIn</a></li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-slate-200 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-slate-600">
              © 2024 TCC Fornecedores. Todos os direitos reservados.
            </p>
            <div className="flex gap-6 text-sm">
              <a href="#" className="text-slate-600 hover:text-slate-900">Privacidade</a>
              <a href="#" className="text-slate-600 hover:text-slate-900">Termos</a>
              <a href="#" className="text-slate-600 hover:text-slate-900">Cookies</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
