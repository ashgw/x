FROM mcr.microsoft.com/devcontainers/typescript-node:18-bookworm

# Git configuration for Codespaces
RUN git config --system codespaces-theme.hide-status 1

USER node
# Zsh plugins
RUN git clone https://github.com/zsh-users/zsh-autosuggestions.git ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-autosuggestions && \
    git clone https://github.com/zsh-users/zsh-syntax-highlighting.git ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-syntax-highlighting

RUN echo 'export DISPLAY="${DISPLAY:-:1}"' | tee -a ~/.bashrc >> ~/.zshrc

USER root

CMD chown -R node:node /site && su node && sleep inf
