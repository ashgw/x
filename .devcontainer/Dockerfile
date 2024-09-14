# Base image src: https://github.com/AshGw/node
FROM ashgw/node:latest

# Terraform setup 
RUN apt-get update && apt-get install -y gnupg software-properties-common curl && \
    wget -qO - https://apt.releases.hashicorp.com/gpg | gpg --dearmor -o /usr/share/keyrings/hashicorp-archive-keyring.gpg && \
    gpg --no-default-keyring --keyring /usr/share/keyrings/hashicorp-archive-keyring.gpg --fingerprint && \
    echo "deb [signed-by=/usr/share/keyrings/hashicorp-archive-keyring.gpg] https://apt.releases.hashicorp.com $(lsb_release -cs) main" | && \
    tee /etc/apt/sources.list.d/hashicorp.list && \
    sudo apt update && sudo apt install terraform 

# tfenv setup 
RUN git clone --depth=1 https://github.com/tfutils/tfenv.git ~/.tfenv && \
    echo 'export PATH="$HOME/.tfenv/bin:$PATH"' >> ~/.zshrc


# Justfile 
RUN sudo apt-get update && \
    sudo apt install curl -y && \
    curl https://sh.rustup.rs -sSf | sh -s -- -y && \
    export PATH="$HOME/.cargo/bin:$PATH" && \ 
    rustup default stable && \ 
    cargo install just
    
# Aliases setup 
ENV DOTFILES_REPO=https://raw.githubusercontent.com/AshGw/dotfiles/main
RUN curl -o "$HOME/.zshrc" "$DOTFILES_REPO/.zshrc"

