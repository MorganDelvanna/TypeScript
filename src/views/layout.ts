import { MenuItem } from "../utils/menuLoader";

export interface LayoutProps {
    menu: MenuItem[];
    currentPath: string;
}

const renderNavigation = (menuMap: MenuItem[], currentPath: string): string => {
  let navHtml =  `<nav class="navbar navbar-expand-lg">
            <div class="mobile-toggle">☰ Menu</div>
            <div class="menu">`;
    menuMap.forEach((item) => {
        const { text, href, children } = item;
        const isActive = currentPath === href ? 'class="active"' : '';
        navHtml += `<div class="item ${(children && children.length)? 'clickable' : ''}"><a href="${href || '#'}">
            ${text}
        </a>`;
        if (children && children.length) {
        navHtml += `<!-- Dropdown children -->
            <div class="dropdown">
                ${children.map((child) => {
                return `<a href="${child.href}" ${isActive}>
                    ${child.text}
                </a>`;
                }).join('')}
            </div>`
        }
        navHtml += `</div>`;        
    });
                      
    navHtml += `</div>
        </nav>`;
  
  return navHtml;
};

export const renderLayout = (props: LayoutProps, content: string): string => `
<!DOCTYPE html>
<html>
    <head>
        <meta charset="UTF-8">
        <meta name="language" content="en-us" />
        <meta name="description" content="Peterborough Fish & Game Association gun club in Peterborough Ontario Canada" />
        <meta name="keywords" content="handgun, rifle, archery, indoor range, outdoor range" />
        <meta name="robots" content="all" />
        <meta name="author" content="Bryan McKellar" />
        <meta name="copyright" content="2018, PFGA" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />

        <title>Peterborough Fish and Game Association: Welcome</title>        
        <link rel="stylesheet" href="/css/bootstrap.min.css" />
        <link rel="stylesheet" href="/css/menu.css" />
        <link rel="stylesheet" href="/css/pfga.css" />
        
        <link rel="shortcut icon" href="/images/pfgalogo.ico" />

        <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.7.1/jquery.min.js" type="text/javascript"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.12.9/umd/popper.min.js" type="text/javascript"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/4.0.0/js/bootstrap.min.js" type="text/javascript"></script>
    </head>

    <body>
        <div class="container">
            <div class="row">
                <div class="col center">
                    <img alt="Peterborough Fish & Game Association" src="/images/header.gif" />
                </div>
            </div>
            <div class="row">
                <div class="col-12">
                    ${renderNavigation(props.menu, props.currentPath)}
                </div>
            </div>
            ${content}
        </div>
        <script type="text/javascript" >
            $(function(){
                $(".clickable").click(function(){
                    $(".clickable").not(this).removeClass("open");
                    $(this).toggleClass("open");
                });
            });
        </script>
    </body>
</html>
`;