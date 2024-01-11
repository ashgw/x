FROM ashgw/node:latest

RUN sudo apt-get update && \
    sudo apt install curl -y && \
    curl https://sh.rustup.rs -sSf | sh -s -- -y && \
    export PATH="$HOME/.cargo/bin:$PATH" && \ 
    rustup default stable && \ 
    cargo install just
    
