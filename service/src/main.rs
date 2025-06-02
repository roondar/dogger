use std::collections::HashMap;
use std::default::Default;
use std::env;

use axum::extract::Path;
use axum::{response::Json, routing::{get, post}, Router};
use bollard::container::{StatsOptions, StartContainerOptions, StopContainerOptions, RestartContainerOptions};
use bollard::image::ListImagesOptions;
use bollard::{container::ListContainersOptions, Docker};
use futures_util::StreamExt;
use serde_json::{json, Value};
use tower_http::services::ServeDir;
use tower_http::validate_request::ValidateRequestHeaderLayer;

const DOGGER_KEY: &str = "DOGGER_KEY";

#[tokio::main]
async fn main() {
    let key = env::var(DOGGER_KEY).unwrap_or("dogger".to_string());
    // hash the key
    let hash = blake3::hash(key.as_bytes());
    let app = Router::new()
        .route("/api/containers", get(get_containers))
        .route("/api/images", get(get_images))
        .route("/api/version", get(get_version))
        .route("/api/ping", get(get_ping))
        .route("/api/containers/:id/stats", get(get_stats))
        .route("/api/containers/:id/start", post(start_container))
        .route("/api/containers/:id/stop", post(stop_container))
        .route("/api/containers/:id/restart", post(restart_container))
        .layer(ValidateRequestHeaderLayer::bearer(hash.to_string().as_str()))
        .nest_service("/", ServeDir::new("../app/dist/"));

    let listener = tokio::net::TcpListener::bind("0.0.0.0:8595").await.unwrap();
    println!("Dogger API running on: http://0.0.0.0:8595");
    axum::serve(listener, app).await.unwrap();
}

async fn get_ping() -> Json<Value> {
    let docker = Docker::connect_with_local_defaults();
    if docker.is_err() {
        return Json(json!({ "error": "Failed to connect to Docker" }));
    }
    let pong = docker.unwrap().ping().await;
    let has_key = env::var(DOGGER_KEY).is_ok();
    match pong {
        Ok(pong) => Json(json!({ "data": pong, "hasKey":  has_key})),
        Err(err) => Json(json!({ "error": err.to_string(), "hasKey":  has_key })),
    }
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

async fn get_stats(Path(id): Path<String>) -> Json<Value> {
    let docker = Docker::connect_with_local_defaults();
    if docker.is_err() {
        return Json(json!({ "error": "Failed to connect to Docker" }));
    }
    let options = Some(StatsOptions {
        stream: false,
        one_shot: true,
    });
    let stats = docker
        .unwrap()
        .stats(&id, options)
        .take(1)
        .next()
        .await
        .unwrap();
    match stats {
        Ok(stats) => Json(json!({ "data": stats })),
        Err(err) => Json(json!({ "error": err.to_string() })),
    }
}

async fn start_container(Path(id): Path<String>) -> Json<Value> {
    let docker = Docker::connect_with_local_defaults();
    if docker.is_err() {
        return Json(json!({ "error": "Failed to connect to Docker" }));
    }
    
    let options = Some(StartContainerOptions::<String> {
        ..Default::default()
    });
    
    let result = docker.unwrap().start_container(&id, options).await;
    match result {
        Ok(_) => Json(json!({ "success": true, "message": "Container started successfully" })),
        Err(err) => Json(json!({ "error": err.to_string() })),
    }
}

async fn stop_container(Path(id): Path<String>) -> Json<Value> {
    let docker = Docker::connect_with_local_defaults();
    if docker.is_err() {
        return Json(json!({ "error": "Failed to connect to Docker" }));
    }
    
    let options = Some(StopContainerOptions {
        t: 10, // 10 seconds timeout
    });
    
    let result = docker.unwrap().stop_container(&id, options).await;
    match result {
        Ok(_) => Json(json!({ "success": true, "message": "Container stopped successfully" })),
        Err(err) => Json(json!({ "error": err.to_string() })),
    }
}

async fn restart_container(Path(id): Path<String>) -> Json<Value> {
    let docker = Docker::connect_with_local_defaults();
    if docker.is_err() {
        return Json(json!({ "error": "Failed to connect to Docker" }));
    }
    
    let options = Some(RestartContainerOptions {
        t: 10, // 10 seconds timeout
    });
    
    let result = docker.unwrap().restart_container(&id, options).await;
    match result {
        Ok(_) => Json(json!({ "success": true, "message": "Container restarted successfully" })),
        Err(err) => Json(json!({ "error": err.to_string() })),
    }
}
