import os
import logging
from typing import Optional, List
from datetime import datetime, timedelta
from collections import Counter #import hashable objects in lists
import requests
from dotenv import load_dotenv
from fastAPI import FastAPI, HTTPException, Header, Depends
from fastaPI.concurrency import run_in_threadpool #run diff APIs in a pool of diff threads
from llama_index.core import (
    Settings,
    SimpleDirectoryReader,
    VectorStoreIndex,
    PromptTemplate,
    StorageContext,
    load_index_from_storage,
)
from llama_index.embeddings.mistralai import MistralAIEmbedding
from llama_index.llms.mistralai import MistralAI

#Llama index setup
llm = MistralAI(
    model="mistral-medium-latest",
    temperature=0.1,
    api_key=MISTRAL_API_KEY,
)
embed_model = MistralAIEmbedding(
    model_name="mistral-embed",
    api_key=MISTRAL_API_KEY,
)
Settings.llm = llm
Settings.embed_model = embed_model

PERSIST_DIR = "./storage"