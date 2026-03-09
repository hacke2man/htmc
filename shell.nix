{ pkgs ? import <nixpkgs> {} }:
pkgs.mkShell {
	buildInputs = with pkgs; [
		nodejs
		pnpm
		typescript-language-server
		vscode-langservers-extracted
	];
	shellHook = ''
		export LSPSERVERS="$LSPSERVERS,html,ts_ls"
	'';
}
