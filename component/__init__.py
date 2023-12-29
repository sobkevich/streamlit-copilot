import os

import streamlit as st
import streamlit.components.v1 as components

_RELEASE = True

if _RELEASE:
    root_dir = os.path.dirname(os.path.abspath(__file__))
    build_dir = os.path.join(root_dir, "frontend/build")

    _copilot = components.declare_component("Copilot", path=build_dir)
else:
    _copilot = components.declare_component("Copilot", url="http://localhost:3001")


def copilot(prompt_template, api_url, rpm_limit=100, height: int = 100, font_family: str = "Helvetica", **model_kwargs):
    return _copilot(
        prompt_template=prompt_template,
        api_url=api_url,
        rpm_limit=rpm_limit,
        height=height,
        font_family=font_family,
        default=None,
        **model_kwargs,
    )


if not _RELEASE:
    value = copilot(
        prompt_template="{text}",
        api_url="https://trusty-humble-jackal.ngrok-free.app/v1/completions",
        rpm_limit=20,
        max_tokens=10,
        stop=["\n", "."],
    )
    st.write(f"Your text: {value}")
