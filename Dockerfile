FROM rust:1.81 AS rust_builder
WORKDIR /usr/src/dogger
COPY ./service/ .
RUN cargo install --path .


FROM node:20 AS node_builder
WORKDIR /usr/src/dogger
COPY ../app/ .
RUN npm install
RUN npm run build

FROM debian:bookworm-slim
WORKDIR /app
COPY --from=rust_builder /usr/local/cargo/bin/dogger .
COPY --from=node_builder /usr/src/dogger/dist ./dist
EXPOSE 8595
CMD ["./dogger"]