import setuptools

with open("README.md", "r") as fh:
    long_description = fh.read()

setuptools.setup(
    name="image_annotation_customize",
    version="0.3.3",
    author="hirune924",
    description="streamlit components for image annotation, with customization",
    long_description=long_description,
    long_description_content_type="text/markdown",
    url="https://github.com/hoc1190/image_annotation",
    packages=setuptools.find_packages(),
    include_package_data=True,
    classifiers=[],
    keywords=['Python', 'Streamlit', 'React', 'JavaScript'],
    python_requires=">=3.6",
    install_requires=[
        "streamlit >= 0.63",
    ],
)