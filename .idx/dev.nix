{ pkgs }: {
  channel = "stable-24.05";

  packages = [
    pkgs.nodejs_20
    pkgs.yarn
    pkgs.nodePackages.pnpm
    pkgs.bun
  ];

  env = {};

  idx = {
    extensions = [
      # Add any VS Code extensions here if needed
    ];

    workspace = {
      onCreate = {
        npm-install = "npm ci --no-audit --prefer-offline --no-progress --timing";
        default.openFiles = [
          "pages/index.tsx" "pages/index.js"
          "src/pages/index.tsx" "src/pages/index.js"
          "app/page.tsx" "app/page.js"
          "src/app/page.tsx" "src/app/page.js"
        ];
      };
    };

    previews = {
      enable = true;

      previews = {
        web = {
          # 🔥 This makes sure the shell interprets $PORT and `&&`
          command = ["npx" "next" "dev" "--port=$PORT" "--hostname=0.0.0.0"];
          manager = "web";
        };
      };
    };
  };
}
