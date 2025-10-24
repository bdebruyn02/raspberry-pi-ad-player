# ---------- Base ----------
FROM ubuntu:plucky

ENV DEBIAN_FRONTEND=noninteractive
WORKDIR /app

# ---------- Core build deps ----------
RUN apt update && \
    apt install -y \
      build-essential ca-certificates curl file git gnupg2 wget \
      g++-aarch64-linux-gnu libc6-dev-arm64-cross libbz2-dev \
      pkg-config python3 python3-mako python3-markdown zlib1g-dev && \
    apt clean

# ---------- Rust + target ----------
RUN curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | \
    sh -s -- -y --target aarch64-unknown-linux-gnu
ENV PATH="/root/.cargo/bin:${PATH}"

# ---------- Node 22 + Angular CLI ----------
RUN curl -fsSL https://deb.nodesource.com/setup_22.x | bash - && \
    apt update && apt install -y --no-install-recommends nodejs && \
    npm install -g @angular/cli@latest && \
    apt clean

# ---------- Enable ARM64 architecture + sources ----------
RUN dpkg --add-architecture arm64
COPY <<EOF /etc/apt/sources.list.d/ubuntu.sources
Types: deb
URIs: http://archive.ubuntu.com/ubuntu/
Suites: plucky plucky-updates plucky-backports
Components: main universe restricted multiverse
Architectures: amd64
Signed-By: /usr/share/keyrings/ubuntu-archive-keyring.gpg

Types: deb
URIs: http://security.ubuntu.com/ubuntu/
Suites: plucky-security
Components: main universe restricted multiverse
Architectures: amd64
Signed-By: /usr/share/keyrings/ubuntu-archive-keyring.gpg

Types: deb
URIs: http://ports.ubuntu.com/ubuntu-ports/
Suites: plucky plucky-updates plucky-backports plucky-security
Components: main universe restricted multiverse
Architectures: arm64
Signed-By: /usr/share/keyrings/ubuntu-archive-keyring.gpg
EOF

# ---------- ARM64 GTK / WebKit / SSL libs ----------
RUN apt update && \
    apt install -y libssl-dev:arm64 libwebkit2gtk-4.1-dev:arm64 \
                   libgtk-3-dev:arm64 libayatana-appindicator3-dev:arm64 \
                   libsqlite3-dev:arm64 librsvg2-dev:arm64 && \
    apt clean

# ---------- Cross-compile env ----------
ENV PKG_CONFIG_PATH=/usr/lib/aarch64-linux-gnu/pkgconfig:/usr/share/pkgconfig \
    PKG_CONFIG_ALLOW_CROSS=1 \
    PKG_CONFIG_SYSROOT_DIR=/usr/aarch64-linux-gnu \
    PKG_CONFIG_ALLOW_SYSTEM_CFLAGS=1 \
    CARGO_TARGET_AARCH64_UNKNOWN_LINUX_GNU_LINKER=/usr/bin/aarch64-linux-gnu-gcc

# ---------- Copy and build ----------
COPY . .

# Install and build using npm
RUN npm install
RUN npm run build:pi
