import os
import streamlit.components.v1 as components
from streamlit.components.v1.components import CustomComponent
from typing import List

import streamlit as st
import streamlit.elements.image as st_image
from PIL import Image
import numpy as np
import matplotlib.pyplot as plt
from hashlib import md5
from streamlit_image_annotation import IS_RELEASE
if IS_RELEASE:
    absolute_path = os.path.dirname(os.path.abspath(__file__))
    build_path = os.path.join(absolute_path, "frontend/build")
    _component_func = components.declare_component("st-detection", path=build_path)
else:
    _component_func = components.declare_component("st-detection", url="http://localhost:3000")

def get_colormap(label_names, colormap_name='gist_rainbow'):
    colormap = {} 
    cmap = plt.get_cmap(colormap_name)
    for idx, l in enumerate(label_names):
        rgb = [int(d) for d in np.array(cmap(float(idx)/len(label_names)))*255][:3]
        colormap[l] = ('#%02x%02x%02x' % tuple(rgb))
    return colormap

#'''
#bboxes:
#[[x,y,w,h],[x,y,w,h]]
#labels:
#[0,3]
#'''
def detection(image_path, label_list, bboxes=None, points=None, neg_points=None,labels=None, height=800, width=512, line_width=5.0, key=None) -> CustomComponent:
    image = Image.open(image_path)
    original_image_size = image.size
    image.thumbnail(size=(width, height))
    resized_image_size = image.size
    scale = original_image_size[0]/resized_image_size[0]
    
    image_url = st_image.image_to_url(image, image.size[0], True, "RGB", "PNG", f"detection-{md5(image.tobytes()).hexdigest()}-{key}")
    if image_url.startswith('/'):
        image_url = image_url[1:]

    color_map = get_colormap(label_list, colormap_name='gist_rainbow')
    bbox_info = [{'bbox':[b/scale for b in item[0]], 'label_id': item[1], 'label': label_list[item[1]]} for item in zip(bboxes, labels)]
    points_info = [{'point':[b/scale for b in item[0]], 'label_id': item[1], 'label': label_list[item[1]]} for item in zip(points, labels)]
    neg_points_info = []#[{'neg_point':[b/scale for b in item[0]], 'label_id': item[1], 'label': label_list[item[1]]} for item in zip(neg_points, labels)]
    print("@@@@")
    print(bbox_info, points_info, neg_points_info)
    component_value = _component_func(image_url=image_url, image_size=image.size, label_list=label_list, bbox_info=bbox_info, points_info=points_info, neg_points_info=neg_points_info,color_map=color_map, line_width=line_width, key=key)
    print(component_value)
    if component_value is not None:
        component_value = [{'bbox':[b*scale for b in item['bbox']], 'label_id': item['label_id'], 'label': item['label']}for item in component_value]
    return component_value

if not IS_RELEASE:
    from glob import glob
    import pandas as pd
    label_list = ['deer', 'human', 'dog', 'penguin', 'framingo', 'teddy bear']
    image_path_list = glob('image/*.jpg')
    if 'result_dict' not in st.session_state:
        result_dict = {}
        for img in image_path_list:
            result_dict[img] = {'bboxes': [[0,0,100,100],[10,20,50,150]],'labels':[0,3], 'points': [[0,0],[50,150], [200,200]],'neg_points':  [[160,160]],'labels':[0,3,4]}
            print("###",img, result_dict[img])
        st.session_state['result_dict'] = result_dict.copy()
    #num_page = st.slider('page', 0, len(image_path_list)-1, 0, key='slider1')
    target_image_path = image_path_list[0]
    print(st.session_state)
    print(target_image_path)
    print(label_list)
    print("###",st.session_state['result_dict'][target_image_path]['points'])
    print("###2",st.session_state['result_dict'][target_image_path]['neg_points'])
    new_labels = detection(image_path=target_image_path, 
                      bboxes=st.session_state['result_dict'][target_image_path]['bboxes'], 
                      points=st.session_state['result_dict'][target_image_path]['points'],
                      neg_points=st.session_state['result_dict'][target_image_path]['neg_points'],
                      labels=st.session_state['result_dict'][target_image_path]['labels'], 
                      label_list=label_list, line_width=5, key=target_image_path)
    if new_labels is not None:
        st.session_state['result_dict'][target_image_path]['bboxes'] = [v['bbox'] for v in new_labels]
        st.session_state['result_dict'][target_image_path]['labels'] = [v['label_id'] for v in new_labels]
        st.session_state['result_dict'][target_image_path]['points'] = [v['point'] for v in new_labels]
        st.session_state['result_dict'][target_image_path]['neg_points'] = [v['neg_point'] for v in new_labels]
    st.json(st.session_state['result_dict'])