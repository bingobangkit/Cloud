import tensorflow as tf
import googleapiclient.discovery
from google.api_core.client_options import ClientOptions

base_classes = ['1_polyethylene_PET',
 '2_high_density_polyethylene_PE-HD',
 '3_polyvinylchloride_PVC',
 'grilled_salmon',
 '4_low_density_polyethylene_PE-LD',
 '5_polypropylene_PP',
 '6_polystyrene_PS',
 '7_other_resins',
 '8_no_plastic']

classes_and_models = {
    "model_1": {
        "classes": base_classes,
        "model_name": "fandi_efficientnet_model"
    },
    "model_2": {
        "classes": base_classes,
        "model_name": "model_v1"
    },
    "model_3": {
        "classes": base_classes,
        "model_name": "third_model"
    }
}

def predict_json(project, region, model, instances, version=None):
    prefix = "{}-ml".format(region) if region else "ml"
    api_endpoint = "https://{}.googleapis.com".format(prefix)
    client_options = ClientOptions(api_endpoint=api_endpoint)
    model_path = "projects/{}/models/{}".format(project, model)
    if version is not None:
        model_path += "/versions/{}".format(version)

    ml_resource = googleapiclient.discovery.build(
        "ml", "v1", cache_discovery=False, client_options=client_options).projects()
    instances_list = instances.numpy().tolist() 
    input_data_json = {"signature_name": "serving_default",
                       "instances": instances_list} 

    request = ml_resource.predict(name=model_path, body=input_data_json)
    response = request.execute()
    
    if "error" in response:
        raise RuntimeError(response["error"])

    return response["predictions"]

def load_and_prep_image(filename, img_shape=224, rescale=False):
  """
    decode image, resize, and normalize 
  """
  img = tf.io.decode_image(filename, channels=3)
  img = tf.image.resize(img, [img_shape, img_shape])
  if rescale:
      return img/255.
  else:
      return img

def update_logger(image, model_used, pred_class, pred_conf, correct=False, user_label=None):
    logger = {
        "image": image,
        "model_used": model_used,
        "pred_class": pred_class,
        "pred_conf": pred_conf,
        "correct": correct,
        "user_label": user_label
    }   
    return logger
