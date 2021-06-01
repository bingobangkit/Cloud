import tensorflow as tf
import googleapiclient.discovery
from google.api_core.client_options import ClientOptions

base_classes = ['chicken_curry',
 'chicken_wings',
 'fried_rice',
 'grilled_salmon',
 'hamburger',
 'ice_cream',
 'pizza',
 'ramen',
 'steak',
 'sushi']

classes_and_models = {
    "model_1": {
        "classes": base_classes,
        "model_name": "go_bin_capstone"
    },
    "model_2": {
        "classes": sorted(base_classes + ["donut"]),
        "model_name": "efficientnet_model_2_11_classes"
    },
    "model_3": {
        "classes": sorted(base_classes + ["donut", "not_food"]),
        "model_name": "efficientnet_model_3_12_classes"
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
