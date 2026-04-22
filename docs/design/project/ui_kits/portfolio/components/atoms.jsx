// atoms.jsx — small primitives shared across the portfolio kit
const { useState, useEffect } = React;

function Tag({ children, variant }) {
  return <span className={`tag ${variant || ''}`}>{children}</span>;
}

function Button({ children, variant, onClick }) {
  return <button className={`btn ${variant || ''}`} onClick={onClick}>{children}</button>;
}

function Meta({ children }) {
  return <span className="meta" style={{fontFamily:'var(--mono)',fontSize:10,letterSpacing:'0.14em',color:'var(--fg-3)',textTransform:'uppercase'}}>{children}</span>;
}

function Quechua({ children }) {
  return <span className="quechua" style={{fontFamily:'var(--small-caps)',fontVariant:'small-caps',fontStyle:'italic',letterSpacing:'0.1em',color:'var(--ochre-700)'}}>{children}</span>;
}

Object.assign(window, { Tag, Button, Meta, Quechua });
