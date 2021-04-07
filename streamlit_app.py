import streamlit as st
import numpy as np
import requests
import json

def get_prediction(data={"GRE Score":337,"TOEFL Score":118,"University Rating":4,"SOP":4.5,"LOR":4.5,"CGPA":9.65,"Research":1}):
  url = 'https://4c9kil1hsi.execute-api.us-east-1.amazonaws.com/Predict/448d1e79-95c2-4535-bada-41843c7d7279'
  r = requests.post(url, data=json.dumps(data))
  response = getattr(r,'_content').decode("utf-8")
  print(response)
  return response

print("Hello world")
# Interactive Streamlit elements, like these sliders, return their value.
# This gives you an extremely simple interaction model.
greScore = st.slider("GRE score", 250, 340, 300)
toeflScore = st.slider("TOEFL score", 90, 120, 100)
cgpa = st.slider("CGPA", 6.0, 10.0, 8.0,0.01)

univRating = st.slider("University rating", 1, 5, 3)
sopValue = 3
lorValue = 3
researchValue = 1


print("GRE=",greScore,";TOEFL=",toeflScore,";CGPA=",cgpa,";Rating=",univRating,";SOP=",sopValue,";LOR=",lorValue)
data={"GRE Score":greScore,"TOEFL Score":toeflScore,"University Rating":univRating,
      "SOP":sopValue,"LOR":lorValue,"CGPA":cgpa,"Research":researchValue}
r=get_prediction(data)
print("R=",r)
j=json.loads(r)
b=j["body"]
print("B=",b)
j2=json.loads(b)
p=j2["predicted_label"]
print("P=",p)
pc=p*100
prob="Probability = {pc:.2f} %"
print("PC=",pc)

st.title(prob.format(pc=pc))
