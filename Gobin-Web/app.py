import os
import json
import requests
import SessionState
import streamlit as st
import tensorflow as tf
from utils import load_and_prep_image, classes_and_models, update_logger, predict_json

os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = "go-bin-capstone-1516532ab6ab.json" # credential service account
PROJECT = "go-bin-capstone" # ID Project
REGION = "asia-southeast1" # Region host model

st.title("Welcome to Gobin Website")
st.header("Identify what's in your plastic code!!!")

@st.cache 
def make_prediction(image, model, class_names):
    image = load_and_prep_image(image)
    image = tf.cast(tf.expand_dims(image, axis=0), tf.int16)
    preds = predict_json(project=PROJECT,
                         region=REGION,
                         model=model,
                         instances=image)
    pred_class = class_names[tf.argmax(preds[0])]
    pred_conf = tf.reduce_max(preds[0])
    return image, pred_class, pred_conf


choose_model = st.sidebar.selectbox(
    "Pick model you'd like to use",
    ("Model 1", 
     "Model 2", 
     "Model 3") 
)

if choose_model == "Model 1":
    CLASSES = classes_and_models["model_1"]["classes"]
    MODEL = classes_and_models["model_1"]["model_name"]
elif choose_model == "Model 2":
    CLASSES = classes_and_models["model_2"]["classes"]
    MODEL = classes_and_models["model_2"]["model_name"]
else:
    CLASSES = classes_and_models["model_3"]["classes"]
    MODEL = classes_and_models["model_3"]["model_name"]

if st.checkbox("Show classes"):
    st.write(f"You chose {MODEL}, these are the classes of plastic code it can identify:\n", CLASSES)

uploaded_file = st.file_uploader(label="Upload an image of plastic code",
                                 type=["png", "jpeg", "jpg"])

session_state = SessionState.get(pred_button=False)

if not uploaded_file:
    st.warning("Please upload an image.")
    st.stop()
else:
    session_state.uploaded_image = uploaded_file.read()
    st.image(session_state.uploaded_image, use_column_width=True)
    pred_button = st.button("Predict")

if pred_button:
    session_state.pred_button = True 

if session_state.pred_button:
    session_state.image, session_state.pred_class, session_state.pred_conf = make_prediction(session_state.uploaded_image, model=MODEL, class_names=CLASSES)
    st.write(f"Prediction: {session_state.pred_class}, \
               Confidence: {session_state.pred_conf*10:.2f}%")

    session_state.feedback = st.selectbox(
        "Is this correct?",
        ("Select an option", "Yes", "No"))
    if session_state.feedback == "Select an option":
        pass
    elif session_state.feedback == "Yes":
        st.write("Thank you for your feedback!")
        print(update_logger(image=session_state.image,
                            model_used=MODEL,
                            pred_class=session_state.pred_class,
                            pred_conf=session_state.pred_conf,
                            correct=True))
    elif session_state.feedback == "No":
        session_state.correct_class = st.text_input("What should the correct label be?")
        if session_state.correct_class:
            st.write("Thank you for that, we'll use your help to make our model better!")
            print(update_logger(image=session_state.image,
                                model_used=MODEL,
                                pred_class=session_state.pred_class,
                                pred_conf=session_state.pred_conf,
                                correct=False,
                                user_label=session_state.correct_class))
