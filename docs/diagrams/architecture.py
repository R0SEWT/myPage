from diagrams import Diagram
from diagrams.c4 import Container, Person, Relationship, SystemBoundary

from common import EDGE_ATTR, GRAPH_ATTR, NODE_ATTR, OUTPUT_FORMAT


with Diagram(
    "Portfolio Application Architecture",
    filename="architecture",
    direction="LR",
    outformat=OUTPUT_FORMAT,
    show=False,
    graph_attr=GRAPH_ATTR,
    node_attr=NODE_ATTR,
    edge_attr=EDGE_ATTR,
):
    visitor = Person(
        "Portfolio visitor",
        "Browses projects, publications, and downloadable CVs.",
        external=True,
    )

    with SystemBoundary("rosewt.dev application"):
        spa = Container(
            "Single-page app",
            "React 19 + Vite + TypeScript",
            "Client-side portfolio experience delivered as a static site.",
        )
        components = Container(
            "UI components",
            "src/components/*",
            "Reusable presentation components for hero, experience, research, and footer sections.",
        )
        content = Container(
            "Content registry",
            "src/data/constants.ts",
            "Centralized structured content for public copy, metadata, and links.",
        )
        styles = Container(
            "Design system styles",
            "src/styles/*",
            "Arariwa design tokens and layout rules applied across the interface.",
        )
        assets = Container(
            "Static assets",
            "public/assets + src/assets",
            "Brand SVGs, imagery, and downloadable files bundled with the site.",
        )

    visitor >> Relationship("loads and explores") >> spa
    spa >> Relationship("renders with") >> components
    components >> Relationship("reads content from") >> content
    components >> Relationship("applies") >> styles
    components >> Relationship("references") >> assets
