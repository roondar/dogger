use std::collections::HashMap;
use std::default::Default;

use axum::http::HeaderValue;
use axum::{response::Json, routing::get, Router};
use bollard::image::ListImagesOptions;
use bollard::{container::ListContainersOptions, Docker};
use serde_json::{json, Value};
use tower_http::cors::CorsLayer;
use tower_http::services::ServeDir;

#[tokio::main]
async fn main() {
    // build our application with a single route
    let app = Router::new()
        .route("/api/containers", get(get_containers))
        .route("/api/images", get(get_images))
        .route("/api/version", get(get_version))
        .nest_service("/", ServeDir::new("../app/dist/"))
        .layer(CorsLayer::new().allow_origin("http://localhost:5173".parse::<HeaderValue>().unwrap()));

    // run our app with hyper, listening globally on port 3000
    let listener = tokio::net::TcpListener::bind("0.0.0.0:8595").await.unwrap();
    axum::serve(listener, app).await.unwrap();
}

async fn get_containers() -> Json<Value> {
    let docker = Docker::connect_with_local_defaults();
    if docker.is_err() {
        return Json(json!({ "error": "Failed to connect to Docker" }));
    }
    let options = Some(ListContainersOptions::<&str> {
        all: true,
        filters: HashMap::new(),
        ..Default::default()
    });
    let containers = docker.unwrap().list_containers(options).await;
    match containers {
        Ok(containers) => Json(json!({ "data": containers })),
        Err(err) => Json(json!({ "error": err.to_string() })),
    }
}

async fn get_images() -> Json<Value> {
    let docker = Docker::connect_with_local_defaults();
    if docker.is_err() {
        return Json(json!({ "error": "Failed to connect to Docker" }));
    }
    let options = Some(ListImagesOptions::<&str> {
        all: true,
        filters: HashMap::new(),
        ..Default::default()
    });
    let images = docker.unwrap().list_images(options).await;
    match images {
        Ok(images) => Json(json!({ "data": images })),
        Err(err) => Json(json!({ "error": err.to_string() })),
    }
}

async fn get_version() -> Json<Value> {
    let docker = Docker::connect_with_local_defaults();
    if docker.is_err() {
        return Json(json!({ "error": "Failed to connect to Docker" }));
    }
    let version = docker.unwrap().version().await;
    match version {
        Ok(version) => Json(json!({ "data": version })),
        Err(err) => Json(json!({ "error": err.to_string() })),
    }
}
