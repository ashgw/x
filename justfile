alias h:= help
alias s:= setup
alias sv:= serve
alias svp:= serve-prod
alias t:= test
alias f:= format
alias l:= lint
alias b:= build
alias rn := reincarnate

@help:
    just --list

@setup:
    #!/bin/zsh
    source ~/.zshrc 
    nvm install 18.17.0 && nvm use 18.17.0
    pnpm i
    pnpm exec playwright install
    pnpm hooks



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

@u:
    docker-compose up
@d:
    docker-compose down


@patch:
    npx changelogen@latest --release --push --patch 

@minor:
    npx changelogen@latest --release --push --minor 

@major:
    npx changelogen@latest --release --push --major 

@reincarnate:
    rm -rf node_modules
    rm -rf .next
    echo 'done cleaning up..'
    echo 'reincarnating..'
    just setup
