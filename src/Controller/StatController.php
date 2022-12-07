<?php

namespace App\Controller;

use App\Navcoin\Block\Api\BlockApi;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Template;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class StatController extends AbstractController
{
    /** @var BlockApi */
    private $blockApi;

    public function __construct(BlockApi $blockApi)
    {
        $this->blockApi = $blockApi;
    }

    /**
     * @Route("/stats")
     * @Template()
     */
    public function index(): array
    {
        return [];
    }
}
?>
