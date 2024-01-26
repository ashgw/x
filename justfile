@help:
    echo "each recipe is a command"
    just --list

@setup:
    #!/bin/zsh
    source ~/.zshrc 
    nvm install 18.17.0 && nvm use 18.17.0
    pnpm i
    pnpm exec playwright install
    pnpm hooks
    # pnpm dev


@serve:
    pnpm dev

@serve-prod:
    pnpm build 
    pnpm start 

@build:
    pnpm build 

@test:
    pnpm test

@lint:
    pnpm lint

@format:
    pnpm format

@deploy:
    echo 'this command is not set yet'

alias rn := reincarnate

@reincarnate:
    rm -rf node_modules
    rm -rf .next
    echo 'done cleaning up..'
    echo 'reincarnating..'
    just setup
