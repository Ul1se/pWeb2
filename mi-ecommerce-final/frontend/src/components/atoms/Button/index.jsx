export default function Button({children,variant="",type="button",...props}){return <button type={type} className={variant||undefined} {...props}>{children}</button>}
