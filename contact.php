<?php
// Sample projects data
$projects = [
    [
        "title" => "Project One",
        "description" => "Description for project one.",
        "image" => "https://via.placeholder.com/300",
        "link" => "#"
    ],
    [
        "title" => "Project Two",
        "description" => "Description for project two.",
        "image" => "https://via.placeholder.com/300",
        "link" => "#"
    ],
    [
        "title" => "Project Three",
        "description" => "Description for project three.",
        "image" => "https://via.placeholder.com/300",
        "link" => "#"
    ]
];

echo json_encode($projects);
?>
